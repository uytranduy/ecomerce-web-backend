import redis from 'redis'
import { promisify } from 'util'
import { getProductById } from '../models/repositories/product.repo'
import { resolve } from 'dns'
import { reservationInventory } from '../models/repositories/inventory.repo'
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTimes = 10
    const expireTime = 3000

    for (let index = 0; index < retryTimes; i++) {
        //ai nam giu duoc vao thanh toan
        const result = await setnxAsync(key, expireTime)
        console.log('result:::', result)
        if (result === 1) {
            const isReservation = await reservationInventory({ productId, quantity, cartId })
            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime)
                return key
            }
            return null
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    const deleteAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await deleteAsyncKey(keyLock)
}

export {
    acquireLock,
    releaseLock
}