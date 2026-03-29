import express from 'express'
import accessController from '../../controllers/access.controller.js'
import { asyncHandler } from '../../auth/checkAuth.js'
import { authentication, refreshAuthentication } from '../../auth/auth.utils.js'
import productController from '../../controllers/product.controller.js'
const productRouter = express.Router()

const productRoutes = (router, url) => {

    productRouter.use(authentication)
    productRouter.post('/create', asyncHandler(productController.createProduct))
    productRouter.get('/', asyncHandler(productController.getAllDraftProductForShop))

    router.use(url, productRouter)


}
export default productRoutes