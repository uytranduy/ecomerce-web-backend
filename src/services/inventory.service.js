import { BadRequestError } from "../core/error.responce"
import { inventory } from "../models/inventory.model"
import { getProductById } from "../models/repositories/product.repo"


class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = `123, Tran Phu, HCM city`
    }) {
        const product = await getProductById(productId)
        if (!product) throw new BadRequestError('The product does not Exists!')

        const query = { inven_shopId: shopId, inven_productId: productId },
            updateSet = {
                $inc: {
                    inven_stock: stock
                },
                $set: {
                    inven_location: location
                }

            }, options = { upsert: true, new: true }
        return await inventory.updateOne(query, updateSet, options)

    }
}

export default InventoryService