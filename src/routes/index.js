import express from 'express'
import accessRoutes from './access/index.js'
import { apiKey, permission } from '../auth/checkAuth.js'
import productRoutes from './product/index.js'
import discountRoutes from './discount/index.js'
import cartRoutes from './cart/index.js'
import checkoutRoutes from './checkout/index.js'
import { inventory } from '../models/inventory.model.js'
import inventoryRoutes from './inventory/index.js'
const router = express.Router()
//check api
router.use(apiKey)

//check permission
router.use(permission('0000'))
checkoutRoutes(router, '/v1/api/checkout')
cartRoutes(router, '/v1/api/cart')
productRoutes(router, '/v1/api/product')
discountRoutes(router, '/v1/api/discount')
inventoryRoutes(router, '/v1/api/inventory')
accessRoutes(router, '/v1/api')

export default router 