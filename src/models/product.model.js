import mongoose, { Schema, model } from "mongoose";
import slugify from "slugify";

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = "Products"



const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_slug: String,
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothings', 'Furnitures'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    //more
    product_ratingsAverange: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})
//Document middleware: runs before .save() and .create()

productSchema.pre('save', function () {
    this.product_slug = slugify(this.product_name, { lower: true })
})
const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'Clothes',
    timestamps: true
})
const electronicSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'Electronics',
    timestamps: true
})
const furnitureSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'Furnitures',
    timestamps: true
})
const product = model(DOCUMENT_NAME, productSchema)
const electronic = model('Electronics', electronicSchema)
const clothing = model('Clothings', clothingSchema)
const furniture = model('Furnitures', furnitureSchema)
export {
    product,
    electronic,
    clothing,
    furniture
}
