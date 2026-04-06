import express from 'express'
import { asyncHandler } from '../../auth/checkAuth.js'
import { authentication } from '../../auth/auth.utils.js'
import inventoryController from '../../controllers/inventory.controller.js'
const inventoryRouter = express.Router()

const inventoryRoutes = (router, url) => {
    //publish

    //auth
    inventoryRouter.use(authentication)
    inventoryRouter.post('/create', asyncHandler(inventoryController.ad))
    inventoryRouter.get('/', asyncHandler(discountController.getAllProductByDiscount))
    router.use(url, inventoryRouter)
}
export default inventoryRoutes