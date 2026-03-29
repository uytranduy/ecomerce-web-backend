
import mongoose from "mongoose"
import keytokenModel from "../models/keytoken.model.js"


class KeyTokenService {
    static createToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        const filter = {
            user: userId
        }, update = {
            publicKey, privateKey, refreshToken
        }, options = {
            upsert: true, new: true
        }
        const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
        return tokens ? tokens.publicKey : null
    }
    static findByUserId = async ({ userId }) => {
        const key = await keytokenModel.findOne({ user: userId })
        console.log(key)
        return key
    }
    static removeKeyById = async (keystore) => {
        return await keytokenModel.deleteOne({ _id: keystore._id })
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokensUsed: refreshToken })
    }
    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken: refreshToken })
    }
    static removeKeyByUserId = async (userId) => {
        return await keytokenModel.deleteOne({ user: userId })
    }

}
export default KeyTokenService