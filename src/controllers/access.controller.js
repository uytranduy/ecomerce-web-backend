import AccessService from "../services/access.service.js"
import { OK, CREATED, SuccessResponce } from "../core/success.responce.js"
class AccessController {

    signIn = async (req, res, next) => {
        new SuccessResponce({
            message: 'Logout success',
            metadata: await AccessService.login(req.body)

        }).send(res)
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered Success',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)
    }
    logOut = async (req, res, next) => {
        new SuccessResponce({
            metadata: await AccessService.logOut(req.keystore)
        }).send(res)
    }
    handlerRefreshToken = async (req, res, next) => {
        new SuccessResponce({
            message: 'Get token success',
            metadata: await AccessService.handlerRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }
}
export default new AccessController