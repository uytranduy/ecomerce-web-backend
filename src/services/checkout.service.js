import { BadRequestError } from "../core/error.responce.js";
import { order } from "../models/order.model.js";
import { checkProductByServer, findCartById } from "../models/repositories/checkout.repo.js";
import DiscountService from "./discount.service.js";
import { acquireLock, releaseLock } from "./redis.service.js";
class CheckoutService {
    static async checkoutReview({
        cartId, userId, shop_order_ids
    }) {
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadRequestError('Cart does not exist')

        const checkout_order = {
            totalPrice: 0,
            feeship: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }, shop_order_ids_new = []
        //tinh tong tien bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
            const checkProductServer = await checkProductByServer(item_products)
            if (!checkProductServer[0]) throw new BadRequestError('order wrong!!!')

            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceAfterApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            if (shop_discounts.length > 0) {
                const { totalPrice = 0, amount = 0 } = await DiscountService.getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                checkout_order.totalDiscount += amount
                if (amount > 0) {
                    itemCheckout.priceAfterApplyDiscount = checkoutPrice - amount
                }
            }
            checkout_order.totalCheckout += itemCheckout.priceAfterApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }

    }

    static async orderByUser({
        shop_order_ids_new,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await this.CheckoutService({
            cartId,
            userId,
            shop_order_ids
        })
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log(`[1]:`, products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i]
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireLock.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }
        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Một số sản phẩm đã được cập nhật, vui lòng quay lại giỏ hàng...')
        }
        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })
        if (newOrder) {
            //remove product in my cart
        }
    }

    /*
    Query Orders [Users]

    */
    static async getOrdersByUser() {

    }
    /*
    Query one Orders [Users]

    */
    static async getOneOrderByUser() {

    }
    /*
    Delete Order [Users]

    */
    static async cancelOrderByUser() {

    }
    /*
   Update Order [Shop, Admin]

    */
    static async updateOrderStatusByShop() {

    }


}
export default CheckoutService