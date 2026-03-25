import express, { Router } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import instanceMongoDb from './dbs/init.mongodb.js'
import { countConnect, checkOverLoad } from './helpers/check.connect.js'
const app = express()


//init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
//init db
instanceMongoDb
countConnect()
checkOverLoad()
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
