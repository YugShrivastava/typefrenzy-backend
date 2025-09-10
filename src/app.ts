import express from "express";
import cors from "cors"
import authRoute from "./routes/auth.route.js"

const app = express();

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        status: "Server running..."
    })
})

app.use('/api/auth', authRoute)


export default app;