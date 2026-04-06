import mongoose, { Schema, model } from "mongoose";


const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = "Orders"

const orderSchema = new Schema({
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    order_shipping: { type: Object, default: {} },
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String, default: '#0000112052022' },
    order_status: { type: String, enum: ['pending', 'comfirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})


const order = model(DOCUMENT_NAME, orderSchema)

export {
    order
}