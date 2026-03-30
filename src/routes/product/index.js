import express from 'express'
import accessController from '../../controllers/access.controller.js'
import { asyncHandler } from '../../auth/checkAuth.js'
import { authentication, refreshAuthentication } from '../../auth/auth.utils.js'
import productController from '../../controllers/product.controller.js'
const productRouter = express.Router()

const productRoutes = (router, url) => {
    //publish
    productRouter.get('/search/:keySearch', asyncHandler(productController.getAllProductBySearch))
    productRouter.get('/', asyncHandler(productController.getAllProducts))

    //auth
    productRouter.use(authentication)
    productRouter.post('/create', asyncHandler(productController.createProduct))
    productRouter.patch('/update/:productId', asyncHandler(productController.updateProduct))
    //PUT//
    productRouter.post('/publish/:id', asyncHandler(productController.publishProductByShop))
    productRouter.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))
    //QUERY//
    productRouter.get('/drafts/all', asyncHandler(productController.getAllDraftProductForShop))
    productRouter.get('/published/all', asyncHandler(productController.getAllPublishedProductForShop))
    router.use(url, productRouter)


}
export default productRoutes