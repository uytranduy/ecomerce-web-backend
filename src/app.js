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

//handlin error

export default app
