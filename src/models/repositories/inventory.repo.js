import { inventory } from "../inventory.model.js"
import { product } from "../product.model.js"



const insertInventory = async ({
    productId, shopId, stock, location = 'unknow'
}) => {
    return await inventory.create({
        inven_productId: productId,
        inven_ShopId: shopId,
        inven_stock: stock,
        inven_location: location
    })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inven_productId: productId,
        inven_stock: { $gte: quantity }
    }, updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservation: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, options = { upset: true, new: true }
    return await inventory.updateOne(query, updateSet, options)
}
export {
    insertInventory,
    reservationInventory
}