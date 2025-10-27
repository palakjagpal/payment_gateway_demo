import express from "express"
import {createOrder, getHome, verifyPayment} from "../controllers/myController.js"

const router = express.Router()

router.get("/",getHome)
router.post("/create-order",createOrder)
router.post("/verify",verifyPayment)

export default router