import { cart } from "../cart.model.js"

import { findOneProductRepo, getProductById } from "./product.repo.js"

const findCartById = async (cartId) => {
    return await cart.findOne({ _id: cartId, cart_state: 'active' }).lean()
}

const checkProductByServer = async (products) => {
    return await Promise.all(products.map(async product => {
        const foundProduct = await getProductById(product.productId)
        if (foundProduct) {
            return {
                price: foundProduct.product_price,
                quantity: product.quantity,
                productId: product.productId
            }
        }
    }))
}
export {
    findCartById,
    checkProductByServer
}