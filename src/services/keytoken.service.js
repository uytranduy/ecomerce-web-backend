import keytokenModel from "../models/keytoken.model.js"

class KeyTokenService {
    static createToken = async ({ userId, publicKey, privateKey }) => {
        try {
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey,
                privateKey,
            })
            return tokens
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}
export default KeyTokenService