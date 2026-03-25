import mongoose from "mongoose";
import config from "../configs/config.mongodb.js"

const { host, port, name } = config.db
const connectString = `mongodb://${host}:${port}/${name}`
class DataBase {
    constructor() {
        this.connect()
    }
    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }
        mongoose.connect(connectString, {
            maxPoolSize: 50
        }).then(_ => {
            console.log('Connected Mongodb Success')
        }).catch(err => console.log(`Error Connect!`))
    }
    static getInstance() {
        if (!DataBase.instance) {
            DataBase.instance = new DataBase()
        }
        return DataBase.instance
    }
}
const instanceMongoDb = DataBase.getInstance()

export default instanceMongoDb