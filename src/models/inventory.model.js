import mongoose, { Schema, model } from "mongoose";


const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = "Inventories"

const inventorySchema = new Schema({
    inven_productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    inven_location: { type: String, default: 'unKnow' },
    inven_stock: { type: Number, required: true },
    inven_ShopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    inven_reservations: { type: Array, default: [] }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})


const inventory = model(DOCUMENT_NAME, inventorySchema)

export {
    inventory
}