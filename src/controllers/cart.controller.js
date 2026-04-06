
import { OK, CREATED, SuccessResponce } from "../core/success.responce.js"
import CartService from "../services/cart.service.js"


class CartController {
    addToUserCart = async (req, res, next) => {
        new SuccessResponce({
            message: 'Add product to cart success',
            metadata: await CartService.addToCart({
                userId: req.body.userId,
                productId: req.params.productId,
                quantity: req.body.quantity
            })
        }).send(res)
    }
    update = async (req, res, next) => {
        new SuccessResponce({
            message: 'Update quantity to cart success',
            metadata: await CartService.updateQuantityOfProductInCart({
                userId: req.body.userId,
                productId: req.params.productId,
                quantity: req.body.quantity
            })
        }).send(res)
    }
    delete = async (req, res, next) => {
        new SuccessResponce({
            message: 'Delete product to cart success',
            metadata: await CartService.deleteProductInCart({
                userId: req.body.userId,
                productId: req.params.productId,
            })
        }).send(res)
    }

}
export default new CartController