import express from 'express'
import accessRoutes from './access/index.js'
import { apiKey, permission } from '../auth/checkAuth.js'
import productRoutes from './product/index.js'
const router = express.Router()
//check api
router.use(apiKey)

//check permission
router.use(permission('0000'))

productRoutes(router, '/v1/api/product')
accessRoutes(router, '/v1/api')

export default router