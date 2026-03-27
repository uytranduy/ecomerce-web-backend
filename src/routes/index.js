import express from 'express'
import accessRoutes from './access/index.js'
import { apiKey, permission } from '../auth/checkAuth.js'
const router = express.Router()
//check api
router.use(apiKey)

//check permission
router.use(permission('0000'))

accessRoutes(router, '/v1/api')

export default router