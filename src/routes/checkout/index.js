import express from 'express'
import { asyncHandler } from '../../auth/checkAuth.js'
import { authentication } from '../../auth/auth.utils.js'
import checkoutController from '../../controllers/checkout.controller.js'

const checkoutRouter = express.Router()

const checkoutRoutes = (router, url) => {
    //publish
    checkoutRouter.post('/review', asyncHandler(checkoutController.reviewCheckout))
    //auth
    checkoutRouter.use(authentication)


    router.use(url, checkoutRouter)
}
export default checkoutRoutes