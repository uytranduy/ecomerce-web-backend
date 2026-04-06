import { unGetSelectData } from "../../utils/index.js"


const findAllDiscountsRepo = async ({ filter, page, limit, sort, unSelect, model }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const unSelectdata = unGetSelectData(unSelect)
    const products = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unSelectdata)
        .lean()
        .exec()
    return products
}
const checkDiscountExisted = async (filter, model) => {
    return await model.findOne(filter)
}
export {
    findAllDiscountsRepo,
    checkDiscountExisted
}