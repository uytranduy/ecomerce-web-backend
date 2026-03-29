import { BadRequestError } from "../core/error.responce.js"
import { clothing, electronic, furniture, product } from "../models/product.model.js"
import { findAllDraftsForShop } from "../models/repositories/product.repo.js"


class ProductFactory {
    static productRegistery = {}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistery[type] = classRef
    }
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistery[type]
        if (!productClass) throw new BadRequestError(`Invalid product type, ${type}`)
        return new productClass(payload).createProduct()
    }

    //query
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }
}
/*
 product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothings', 'Furnitures'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    product_attributes: { type: Schema.Types.Mixed, required: true }
*/
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }
    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id })
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError('Create new Clothing error')

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError('Create new Clothing error')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('Create new Clothing error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct
    }
}

ProductFactory.registerProductType('Furnitures', Furniture)
ProductFactory.registerProductType('Clothings', Clothing)
ProductFactory.registerProductType('Electronics', Electronic)
export default ProductFactory