import express from "express"
import type { Express, Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
dotenv.config()

const corsOption = {
    origin: process.env.TRUSTED_ORIGIN?.split(",") || [],
    credentials: true,
}
const app: Express = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors(corsOption))
app.use("/", (req: Request, res: Response) => {
    res.json({ success: true, message: "Server started successfully" })
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
