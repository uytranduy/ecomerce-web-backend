
import { OK, CREATED, SuccessResponce } from "../core/success.responce.js"
import DiscountService from "../services/discount.service.js"


class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessResponce({
            message: 'Create discount code success',
            metadata: await DiscountService.createDiscountCode(
                req.user.userId,
                req.body
            )
        }).send(res)
    }
    getAllProductByDiscount = async (req, res, next) => {
        new SuccessResponce({
            message: 'Create discount code success',
            metadata: await DiscountService.getAllProductWithDiscount(
                req.user.userId,
                req.query
            )
        }).send(res)
    }



}
export default new DiscountController