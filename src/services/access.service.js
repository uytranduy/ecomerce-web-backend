import shopeModel from "../models/shop.model.js"
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import KeyTokenService from "./keytoken.service.js"
import { createTokenPair } from "../auth/auth.utils.js"
import { getIntoData } from "../utils/index.js"
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITER: 'EDITER',
    ADMIN: 'ADMIN'
}
class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            //check email is exist
            const holderShop = await shopeModel.findOne({ email }).lean()
            if (holderShop) {
                return {
                    code: 'xxxx',
                    message: 'Shop already registered!'
                }
            }

            //hash password
            const hashPassword = await bcrypt.hash(password, 10)
            //create shop
            const newShop = await shopeModel.create({
                name: name, email, password: hashPassword, roles: [RoleShop.SHOP]
            })
            if (newShop) {
                const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 2048,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem'
                    }
                })

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
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

export default AccessService