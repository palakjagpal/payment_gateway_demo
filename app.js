import express from "express"
import dotenv from "dotenv"
import connectDB  from "./config/db.js"
import myRoutes from "./routes/myRoutes.js"
import path from "path"

dotenv.config()
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static("public"));


app.set("view engine","pug")
app.set("views", path.join(process.cwd(), "views"))

app.use("/",myRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running at localhost http://localhost:${PORT}`))
