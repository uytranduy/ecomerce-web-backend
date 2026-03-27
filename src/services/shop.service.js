import shopModel from "../models/shop.model.js"


class ShopService {
    static findByEmail = async ({ email, select = {
        emai: 1, password: 1, name: 1, status: 1, roles: 1
    } }) => {
        return await shopModel.findOne({ email }).select(select).lean()
    }
}

export default ShopService