import shopeModel from "../models/shop.model.js"
import bcrypt from 'bcrypt'
import KeyTokenService from "./keytoken.service.js"
import { createTokenPair, verifyJWT } from "../auth/auth.utils.js"
import { getIntoData } from "../utils/index.js"
import { AuthFailureError, BadRequestError, ForbiddenErorr, } from "../core/error.responce.js"
import ShopService from "./shop.service.js"
import { CreateRSAToken } from "../utils/rsa.key.js"

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITER: 'EDITER',
    ADMIN: 'ADMIN'
}
class AccessService {
    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await ShopService.findByEmail({ email })
        if (!foundShop) {
            throw new BadRequestError(`Email or passowrd is invalid`)
        }
        //matchPassword

        const match = await bcrypt.compare(password, foundShop.password)
        if (!match) {
            throw new AuthFailureError(`Email or passowrd is invalid`)
        }

        //create AT vs RT and save
        const { publicKey, privateKey } = CreateRSAToken()
        const tokens = await createTokenPair({
            payload: {
                userId: foundShop._id,
                email
            },
            privateKey,
            publicKey
        })
        await KeyTokenService.createToken({ userId: foundShop._id, privateKey, publicKey, refreshToken: tokens.refreshToken })

        return {
            shop: getIntoData({ fields: ['name', 'email', '_id'], object: foundShop }),
            tokens
        }



    }
    static signUp = async ({ name, email, password }) => {
        // try {
        //check email is exist
        const holderShop = await shopeModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError('Error: Shop already registed')
        }

        //hash password
        const hashPassword = await bcrypt.hash(password, 10)
        //create shop
        const newShop = await shopeModel.create({
            name: name, email, password: hashPassword, roles: [RoleShop.SHOP]
        })
        if (newShop) {
            const { publicKey, privateKey } = CreateRSAToken()

            //save collection KeyStore
            const keyStore = await KeyTokenService.createToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })

            //check keystring
            if (!keyStore) {
                return {
                    code: 'xxxx',
                    message: 'pubicKeyString error!'
                }
            }

            //create pair token
            const tokens = await createTokenPair({
                payload: {
                    userId: newShop._id,
                    email
                },
                privateKey,
                publicKey
            })
            console.log(tokens)
            return {
                code: 201,
                metadata: {
                    shop: getIntoData({ fields: ['name', 'email', '_id'], object: newShop }),
                    tokens
                }
            }
        }
        return {
            code: 201,
            metadata: null
        }
    }
    static logOut = async (keyStore) => {
        return await KeyTokenService.removeKeyById(keyStore)
    }
    static handlerRefreshToken = async ({ refreshToken, user, keyStore }) => {
        const { userId, email } = user

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.removeKeyByUserId(userId)
            throw new ForbiddenErorr('Something wrong happend!! Please relogin')
        }

        if (keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError('Shop not registered')
        }
        const foundShop = await ShopService.findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not registered')

        const tokens = await createTokenPair({
            payload: {
                userId,
                email
            },
            publicKey: keyStore.publicKey,
            privateKey: keyStore.privateKey
        })
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })
        return {
            shop: getIntoData({ fields: ['name', 'email', '_id'], object: foundShop }),
            tokens
        }
    }
}

export default AccessService