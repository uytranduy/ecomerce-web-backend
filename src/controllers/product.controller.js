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
    updateProduct = async (req, res, next) => {
        new SuccessResponce({
            message: 'Update product success',
            metadata: await ProductFactory.updateProduct(
                req.body.product_type,
                req.params.productId,
                {
                    ...req.body
                }
            )
        }).send(res)
    }
    //PUT// 

    publishProductByShop = async (req, res, next) => {
        console.log('controller id =', JSON.stringify(req.params.id))
        new SuccessResponce({
            message: 'Publish product success',
            metadata: await ProductFactory.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        console.log('controller id =', JSON.stringify(req.params.id))
        new SuccessResponce({
            message: 'unPublish product success',
            metadata: await ProductFactory.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
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
    getAllPublishedProductForShop = async (req, res, next) => {
        new SuccessResponce({
            message: 'Get a Draft list success',
            metadata: await ProductFactory.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }
    getAllProductBySearch = async (req, res, next) => {
        new SuccessResponce({
            message: 'get list with search success',
            metadata: await ProductFactory.searchProductByUser({
                keySearch: req.params.keySearch
            })
        }).send(res)
    }
    /**
     * 
     * @param {filter} 
     * @param {page} 
     * @param {limit} 
     * @param {sort}
     * @param {select}
     */
    getAllProducts = async (req, res, next) => {
        new SuccessResponce({
            message: 'get product list success',
            metadata: await ProductFactory.findAllProducts(req.query)
        }).send(res)
    }
    getOneProduct = async (req, res, next) => {
        new SuccessResponce({
            message: 'get product success',
            metadata: await ProductFactory.findOneProduct({
                product_id: req.params.product_id,
                unselect: req.query.unselect
            })
        }).send(res)
    }
    //END QUERY

}
export default new ProductController