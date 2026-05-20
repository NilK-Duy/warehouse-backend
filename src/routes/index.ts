import { Router } from 'express'

import productRoutes from './product.routes'
import receiptRoutes from './receipt.routes'

const router = Router()

router.use('/products', productRoutes)
router.use('/receipts', receiptRoutes)

export default router
