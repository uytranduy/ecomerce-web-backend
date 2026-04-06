import { Schema } from "mongoose"
import { BadRequestError } from "../core/error.responce.js"
import { cart } from "../models/cart.model.js"
import { findOneProductRepo } from "../models/repositories/product.repo.js"

class CartService {
    static async createUserCart(userId, productInCart) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: productInCart
                }
            }, options = { upsert: true, new: true }

        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }
    static async updateQuantityInCart({ userId, productId, quantity }) {
        const query = {
            cart_userId: userId,
            "cart_products.productId": productId
        },
            updateOrInsert = {
                $inc: {
                    "cart_products.$.quantity": quantity
                }
            },
            options = { new: true }
        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }
    static async addProductToCart(userId, productInCart) {
        const query = {
            cart_userId: userId,
            cart_state: 'active'
        },
            updateOrInsert = {
                $push: {
                    cart_products: productInCart
                }
            },
            options = { new: true }
        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }
    static async addToCart({ userId, productId, quantity = 1 }) {
        const foundProduct = await findOneProductRepo({
            product_id: productId,
            unselect: ['__v']
        })
        if (!foundProduct) throw new BadRequestError('Not found product')
        const productInCart = {
            productId: foundProduct._id,
            productName: foundProduct.product_name,
            productThumb: foundProduct.product_thumb,
            quantity: quantity,
            price: foundProduct.product_price,
        }
        const userCart = await cart.findOne({ cart_userId: userId, cart_state: 'active' })
        if (!userCart) {
            return await CartService.createUserCart(userId, productInCart)
        }
        const isExistingProduct = userCart.cart_products.find(
            product => product.productId.toString() === productId.toString()
        )
        if (!isExistingProduct) {
            return await this.addProductToCart(userId, productInCart)
        } else {
            return await this.updateQuantityInCart({ userId, productId, quantity })
        }

    }
    static async updateQuantityOfProductInCart({
        userId,
        productId,
        quantity
    }) {
        if (quantity < 0) {
            throw new BadRequestError(
                "Quantity must be greater than or equal to 0"
            )
        }
        const userCart = await cart.findOne({
            cart_userId: userId,
            cart_state: "active"
        })
        if (!userCart) {
            throw new BadRequestError("Not found cart")
        }
        const productIndex =
            userCart.cart_products.findIndex(
                product =>
                    product.productId.toString() ===
                    productId.toString()
            )
        if (productIndex === -1) {
            throw new BadRequestError(
                "Product not found in cart"
            )
        }
        if (quantity === 0) {
            return await this.deleteProductInCart({
                userId,
                productId
            })
        }
        const delta = quantity - userCart.cart_products[productIndex].quantity
        return await this.updateQuantityInCart({
            userId,
            productId,
            quantity: delta
        })
    }
    static async deleteProductInCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId: productId
                    }
                }
            },
            options = { new: true }
        return await cart.updateOne(query, updateSet, options)
    }
}

export default CartService