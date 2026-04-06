
import { OK, CREATED, SuccessResponce } from "../core/success.responce.js"
import InventoryService from "../services/inventory.service"



class InventoryController {
    addStock = async (req, res, next) => {
        new SuccessResponce({
            message: 'Create discount code success',
            metadata: await InventoryService.addStockToInventory(
                req.body
            )
        }).send(res)
    }
}
export default new InventoryController