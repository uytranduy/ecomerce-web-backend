import jwt from 'jsonwebtoken'

const createTokenPair = async ({ payload, publicKey, privateKey }) => {
    try {
        //create accesstoken
        const accessToken = await jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })
        //create refreshtoken
        const refreshToken = await jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: '7 days'
        })

        jwt.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(`error verify:: ${err}`)
            } else {
                console.log(`decode verify:: ${decode}`)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error)
        throw error
    }
}
export {
    createTokenPair
}