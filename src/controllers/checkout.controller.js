
import { OK, CREATED, SuccessResponce } from "../core/success.responce.js"
import CheckoutService from "../services/checkout.service.js"


class CheckoutController {
    reviewCheckout = async (req, res, next) => {
        new SuccessResponce({
            message: 'Review checkout success',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }


}
export default new CheckoutController