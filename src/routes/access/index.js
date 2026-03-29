import express from 'express'
import accessController from '../../controllers/access.controller.js'
import { asyncHandler } from '../../auth/checkAuth.js'
import { authentication, refreshAuthentication } from '../../auth/auth.utils.js'
const accessRouter = express.Router()

const accessRoutes = (router, url) => {
    accessRouter.post('/shop/signup', asyncHandler(accessController.signUp))
    accessRouter.post('/shop/signin', asyncHandler(accessController.signIn))
    accessRouter.post('/shop/refresh', refreshAuthentication, asyncHandler(accessController.handlerRefreshToken))
    //authentication
    accessRouter.use(authentication)
    ///
    accessRouter.post('/shop/logout', asyncHandler(accessController.logOut))

    router.use(url, accessRouter)


}
export default accessRoutes