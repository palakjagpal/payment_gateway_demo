import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema({
    orderId : {type:String, required:true},
    paymentId : {type:String},
    status : {type:String, required:true},
    amount : {type:Number, required:true}
},
  {timestamp : true }
)

const Payment = mongoose.model("Payment", paymentSchema)
export default Payment