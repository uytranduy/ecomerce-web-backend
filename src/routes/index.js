import express from 'express'
import accessRoutes from './access/index.js'
const router = express.Router()

accessRoutes(router, '/v1/api')

export default router