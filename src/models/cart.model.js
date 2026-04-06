import mongoose, { Schema, model } from "mongoose";


const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = "Carts"
const cartproductSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    productThumb: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    price: { type: Number, required: true, default: 0, min: 0 },
    isSelected: { type: Boolean, default: true }
}, {
    _id: false,
    timestamps: true
})
const cartSchema = new Schema({
    cart_state: {
        type: String, required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cart_products: {
        type: [cartproductSchema], default: [],

    },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, required: true }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})


const cart = model(DOCUMENT_NAME, cartSchema)
export {
    cart
}