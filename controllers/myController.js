import Razorpay from "razorpay";
import Payment from "../models/Payment.js";
import crypto from "crypto";

// Render home page
export const getHome = async (req, res) => {
  res.render("index", { title: "Razorpay Payment Demo" });
};

// Create order
export const createOrder = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 1000;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      orderId: order.id,
      status: "created",
      amount,
    });

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating order");
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      const payment = await Payment.findOne({ orderId: razorpay_order_id });
      payment.status = "paid";
      payment.paymentId = razorpay_payment_id;
      await payment.save();

      res.render("paymentSuccess", { title: "Payment Successful", payment });
    } else {
      res.status(400).send("Payment verification failed");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error verifying payment");
  }
};
