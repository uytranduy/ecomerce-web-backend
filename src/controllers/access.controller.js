import AccessService from "../services/access.service.js"

class AccessController {
    signUp = async (req, res, next) => {
        try {
            console.log(`[P]::signUp::`, req.body)
            const { name, email, password } = req.body
            const data = await AccessService.signUp({ name, email, password })
            return res.status(201).json({
                code: '20001',
                metadata: data
            })
        } catch (error) {
            next(error)
        }
    }
}
export default new AccessController