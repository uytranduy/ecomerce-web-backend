
import { BadRequestError, NotFound } from '../core/error.responce.js'
import { discount } from '../models/discount.model.js'
import { checkDiscountExisted, findAllDiscountsRepo } from '../models/repositories/discount.repo.js'
import { findAllProductsRepo } from '../models/repositories/product.repo.js'
class DiscountService {

    static async createDiscountCode(shopId, payload) {
        const {
            code, start_date, end_date, is_active,
            min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, uses_count, max_uses_per_user
        } = payload
        if (new Date() > new Date(end_date))
            throw new BadRequestError('Discount code has expired!')
        if (new Date(start_date) >= new Date(end_date))
            throw new BadRequestError('Start_date must be before end_date')
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: shopId
        })
        if (foundDiscount) throw new BadRequestError('Discount code existed')

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_type: type,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_max_uses: max_uses,
            discount_max_value: max_value,
            discount_uses_count: uses_count,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
            discount_value: value
        })
        return newDiscount
    }

    static async updateDiscountCode(discountId, payload) {

    }
    static async getAllProductWithDiscount(shopId, {
        code, limit = 50, page = 1
    }) {
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: shopId,
        })
        if (!foundDiscount || foundDiscount.discount_is_active === false)
            throw new BadRequestError('Discount not esixted or inActive')

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to === 'all') {
            products = await findAllProductsRepo({
                filter: {
                    product_shop: shopId,
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discount_applies_to === 'specific') {
            products = await findAllProductsRepo({
                filter: {
                    product_shop: shopId,
                    isPublished: true,
                    _id: { $in: discount_product_ids }
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products
    }

    static async getAllDiscountCode({ shopId, limit = 50, page = 1 }) {
        return await findAllDiscountsRepo({
            filter: {
                discount_shopId: shopId,
                discount_is_active: true
            },
            limit: limit,
            page: page,
            sort: 'ctime',
            unSelect: ['__v', 'discount_shopId'],
            model: discount

        })
    }
    static async getDiscountAmount({
        codeId, userId, shopId, products
    }) {
        const foundDiscount = await checkDiscountExisted({
            discount_code: codeId,
            discount_shopId: shopId
        }, discount)
        if (!foundDiscount) throw new NotFound(`discount doesn't exist`)
        const { discount_is_active, discount_max_uses, discount_start_date, discount_end_date,
            discount_min_order_value, discount_users_used, discount_max_uses_per_user,
            discount_type, discount_value } = foundDiscount
        if (!discount_max_uses) throw new BadRequestError(`Discount are out`)
        if (!discount_is_active || new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date))
            throw new BadRequestError(`Discout has expired`)
        const totalOrder = products.reduce((acc, product) => {
            return acc + (product.quantity * product.price)
        }, 0)


        if (discount_min_order_value > 0 && totalOrder < discount_min_order_value)
            throw new BadRequestError(`Dis count requires a minimum order value of ${discount_min_order_value}`)

        if (discount_max_uses_per_user > 0) {
            const userUserDiscount = discount_users_used.find(user => user.userId === userId)
            if (userUserDiscount) {

            }
        }
        const amount = discount_type === 'fixed_amount' ? discount_value : (totalOrder * discount_value / 100)
        return {
            totalOrder,
            amount,
            totalPrice: totalOrder - amount
        }
    }
    static async deleteDiscountcode({
        shopId, codeId
    }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: shopId
        })
        return deleted
    }
    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExisted({
            discount_code: codeId,
        }, discount

        )
        if (!foundDiscount) throw new NotFound(`discount doesn't exist`)
        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })
        return result
    }

}

export default DiscountService