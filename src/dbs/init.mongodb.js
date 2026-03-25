import mongoose from "mongoose";

const connectString = `mongodb://localhost:27017/ecommerceWeb`
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