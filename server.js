import app from "./src/app.js";
import config from "./src/configs/config.mongodb.js"
const PORT = config.app.port
const server = app.listen(PORT, () => {
    console.log(`WSV cCommerce start with ${PORT} `)
})

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`))
})