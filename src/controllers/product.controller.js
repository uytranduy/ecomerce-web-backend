import ProductFactory from "../services/product.service.js"

import { OK, CREATED, SuccessResponce } from "../core/success.responce.js"


class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponce({
            message: 'Create product success',
            metadata: await ProductFactory.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId
                }
            )
        }).send(res)
    }


    //QUERY//
    getAllDraftProductForShop = async (req, res, next) => {
        new SuccessResponce({
            message: 'Get a Draft list success',
            metadata: await ProductFactory.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }
    //END QUERY

}
export default new ProductController