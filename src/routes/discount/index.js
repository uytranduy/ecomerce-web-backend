import express from 'express'
import { asyncHandler } from '../../auth/checkAuth.js'
import { authentication } from '../../auth/auth.utils.js'
import discountController from '../../controllers/discount.controller.js'
const discountRouter = express.Router()

const discountRoutes = (router, url) => {
    //publish

    //auth
    discountRouter.use(authentication)
    discountRouter.post('/create', asyncHandler(discountController.createDiscountCode))
    discountRouter.get('/', asyncHandler(discountController.getAllProductByDiscount))
    router.use(url, discountRouter)
}
export default discountRoutes