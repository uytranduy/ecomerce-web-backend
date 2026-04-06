import mongoose, { model } from "mongoose"
import { product } from "../product.model.js"
import { filterFieldToUpdate, flattenObject, getSelectData, unGetSelectData } from "../../utils/index.js"

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}
const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: product_shop,
        _id: product_id
    })
    if (!foundProduct) return null
    foundProduct.isDraft = false
    foundProduct.isPublished = true
    const { modifiedCount } = await foundProduct.updateOne(foundProduct)
    return modifiedCount
}
const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: product_shop,
        _id: product_id
    })
    if (!foundProduct) return null
    foundProduct.isDraft = true
    foundProduct.isPublished = false
    const { modifiedCount } = await foundProduct.updateOne(foundProduct)
    return modifiedCount
}
const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}
const queryProduct = async ({ query, skip, limit }) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}
const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        $text: { $search: regexSearch },
        isPublished: true
    }, {
        score: { $meta: "textScore" }
    })
        .sort({
            score: { $meta: "textScore" }
        })
        .lean()
    return results
}
const findAllProductsRepo = async ({ filter, page, limit, sort, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const selectdata = getSelectData(select)
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(selectdata)
        .lean()
        .exec()
    return products
}
const findOneProductRepo = async ({ product_id, unselect }) => {
    const unSelectData = unGetSelectData(unselect)
    const foundProduct = await product.findOne({ _id: product_id })
        .select(unSelectData)
        .lean()
        .exec()
    return foundProduct
}
const updateProductByIdRepo = async ({ productId, payload, updateModel }) => {
    console.log(payload)
    const filteredPayload = filterFieldToUpdate(payload)
    const fattendPayload = flattenObject(filteredPayload)

    console.log(fattendPayload)
    const productUpdated = await updateModel.findByIdAndUpdate(
        productId,
        { $set: fattendPayload },
        { new: true }
    )
    return productUpdated
}
const getProductById = async (productId) => {
    return await product.findOne({ _id: productId })
}
export {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProductsRepo,
    findOneProductRepo,
    updateProductByIdRepo,
    queryProduct,
    getProductById
}