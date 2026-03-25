import express from 'express'
import accessController from '../../controllers/access.controller.js'
const accessRouter = express.Router()

const accessRoutes = (router, url) => {
    accessRouter.post('/shop/signup', accessController.signUp)
    router.use(url, accessRouter)
}
export default accessRoutes