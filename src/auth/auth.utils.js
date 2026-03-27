import jwt from 'jsonwebtoken'
import { asyncHandler } from './checkAuth.js'
import { AuthFailureError, NotFound } from '../core/error.responce.js'
import KeyTokenService from '../services/keytoken.service.js'
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id'
}

const createTokenPair = async ({ payload, publicKey, privateKey }) => {
    try {
        //create accesstoken
        const accessToken = await jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })
        //create refreshtoken
        const refreshToken = await jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: '7 days'
        })

        jwt.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(`error verify:: ${err}`)
            } else {
                console.log(`decode verify:: ${decode}`)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error)
        throw error
    }
}

const authentication = asyncHandler(
    async (req, res, next) => {
        const userId = req.headers[HEADER.CLIENT_ID]
        if (!userId) throw new AuthFailureError('Invalid Request')

        const keystore = await KeyTokenService.findByUserId({ userId })
        if (!keystore) throw new NotFound('Not found keystore')

        const accessToken = req.headers[HEADER.AUTHORIZATION]
        if (!accessToken) throw new AuthFailureError('Invalid Request')

        try {
            const encoded = jwt.verify(accessToken, keystore.publicKey)
            if (encoded.userId.toString() !== userId) throw new AuthFailureError('Invalid Userid')
            req.keystore = keystore
            return next()
        } catch (error) {
            throw new AuthFailureError('Invalid Token')
        }
    }
)
const verifyJWT = async (refreshToken, privateKey) => {
    return await jwt.verify(refreshToken, privateKey)
}
export {
    createTokenPair,
    authentication,
    verifyJWT
}