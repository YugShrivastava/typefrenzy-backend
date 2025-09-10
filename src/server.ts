import { createServer } from "http";
import env from "./config/config.js";
import app from "./app.js"
import connect from "./connection.js"

const PORT = env.PORT || 8000
const server = createServer(app)

server.listen(PORT, (): void => {
    console.log("Server running at PORT: " + PORT)
})

connect.then(() => console.log('MongoDB Connected...')).catch(err => console.log('Error in mongodb connectivity: ', err))

