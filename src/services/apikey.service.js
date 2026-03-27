import apikeyModel from "../models/apikey.model.js"

class APIKeyService {
    static findKeyById = async (key) => {

        try {
            // const obj = await apikeyModel.create({ key, permissions: '0000' })
            // console.log(obj)
            const objKey = await apikeyModel.findOne({ key: key, status: true }).lean()
            return objKey
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export default APIKeyService