import express, { Router } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
const app = express()


//init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
//init db

//init routes
app.get('/', (req, res, next) => {
    const dataString = "hello tipjs"
    return res.status(200).json({
        message: "Welcome Fantipjs!",
        metadata: dataString.repeat(1000000)
    })
})

//handlin error

export default app
