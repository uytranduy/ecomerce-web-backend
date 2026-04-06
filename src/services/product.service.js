import { BadRequestError } from "../core/error.responce.js"
import { insertInventory } from "../models/repositories/inventory.repo.js"
import { clothing, electronic, furniture, product } from "../models/product.model.js"
import { findAllDraftsForShop, publishProductByShop, findAllPublishForShop, unPublishProductByShop, searchProductByUser, findAllProductsRepo, findOneProductRepo, updateProductByIdRepo } from "../models/repositories/product.repo.js"


class ProductFactory {
    static productRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type, ${type}`)
        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, product_id, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type, ${type}`)
        return new productClass(payload).updateProduct(product_id)
    }


    //put
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }
    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }
    //query
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }
    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }
    static async searchProductByUser({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }
    static async findAllProducts({ filter = { isPublished: true }, page = 1, limit = 50, sort = 'ctime', select = ['product_name', 'product_price', 'product_thumb'] }) {
        return await findAllProductsRepo({
            filter, page, limit, sort, select
        })
    }
    static async findOneProduct({ product_id, unselect = ['__v'] }) {
        return await findOneProductRepo({ product_id, unselect })
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
    async createProduct(productId) {
        const newProduct = await product.create({ ...this, _id: productId })
        if (!newProduct) throw new BadRequestError('Create new Product error')
        return await insertInventory({
            productId: newProduct._id,
            stock: this.product_quantity,
            shopId: this.product_shop,
        })
    }
    async updateProduct(productId) {
        return await updateProductByIdRepo({
            productId,
            payload: this,
            updateModel: product
        })
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
    async updateProduct(productId) {

        if (this.product_attributes) {
            const updatedClothing = await updateProductByIdRepo({
                productId: productId,
                payload: this.product_attributes,
                updateModel: clothing
            })
            if (!updatedClothing) throw new BadRequestError('Update clothing error')
        }
        const updatedProduct = await super.updateProduct(productId)
        if (!updatedProduct) throw new BadRequestError('Update product error')
        return updatedProduct
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
    async updateProduct(productId) {

        if (this.product_attributes) {
            const updatedElectronic = await updateProductByIdRepo({
                productId: productId,
                payload: this.product_attributes,
                updateModel: electronic
            })
            if (!updatedElectronic) throw new BadRequestError('Update electronic product error')
        }
        const updatedProduct = await super.updateProduct(productId)
        if (!updatedProduct) throw new BadRequestError('Update product error')
        return updatedProduct
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('Create new Furniture error')

        const newProduct = await super.createProduct(newFurniture._id)

        return newProduct
    }
    async updateProduct(productId) {

        if (this.product_attributes) {
            const updatedFurniture = await updateProductByIdRepo({
                productId: productId,
                payload: this.product_attributes,
                updateModel: furniture
            })
            if (!updatedFurniture) throw new BadRequestError('Update Furniture product error')
        }
        const updatedProduct = await super.updateProduct(productId)
        if (!updatedProduct) throw new BadRequestError('Update product error')
        return updatedProduct
    }
}

ProductFactory.registerProductType('Furnitures', Furniture)
ProductFactory.registerProductType('Clothings', Clothing)
ProductFactory.registerProductType('Electronics', Electronic)
export default ProductFactory