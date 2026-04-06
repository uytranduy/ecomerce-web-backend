import express from 'express'
import { asyncHandler } from '../../auth/checkAuth.js'
import { authentication } from '../../auth/auth.utils.js'

import cartController from '../../controllers/cart.controller.js'
const cartRouter = express.Router()

const cartRoutes = (router, url) => {
    //publish
    cartRouter.post('/:productId', asyncHandler(cartController.addToUserCart))
    cartRouter.patch('/update/:productId', asyncHandler(cartController.update))
    cartRouter.post('/delete/:productId', asyncHandler(cartController.delete))
    //auth
    cartRouter.use(authentication)


    router.use(url, cartRouter)
}
export default cartRoutes