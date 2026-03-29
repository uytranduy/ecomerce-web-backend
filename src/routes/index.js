import express from 'express'
import accessRoutes from './access/index.js'
import { apiKey, permission } from '../auth/checkAuth.js'
import productRoutes from './product/index.js'
const router = express.Router()
//check api
router.use(apiKey)

//check permission
router.use(permission('0000'))

accessRoutes(router, '/v1/api')
productRoutes(router, '/v1/api/product')
export default router