import express, { Router } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import instanceMongoDb from './dbs/init.mongodb.js'
import { countConnect, checkOverLoad } from './helpers/check.connect.js'
import dotenv from 'dotenv'
import router from './routes/index.js'
const app = express()

dotenv.config()

//init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//init db
instanceMongoDb
//countConnect()
//checkOverLoad()


//init routes
app.use(router)

//handling error
app.use((err, req, res, next) => {
    console.error("=== ERROR START ===")
    console.error("Message:", err.message)
    console.error("Stack:", err.stack)
    console.error("=== ERROR END ===")

    return res.status(err.status || 500).json({
        status: "error",
        code: err.status || 500,
        message: err.message
    })
})
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
})



export default app
