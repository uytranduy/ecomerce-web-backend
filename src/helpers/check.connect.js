import mongoose from "mongoose";
import os from 'os'

const _SECOND = 5000
const countConnect = () => {
    const numConnection = mongoose.connections.length

    console.log(`Number of connection:: ${numConnection}`)
}
const checkOverLoad = () => {
    setInterval(async () => {
        try {
            const admin = mongoose.connection.db.admin()
            const status = await admin.serverStatus()

            const numConnections = status.connections.current
            const numCores = os.cpus().length
            const memoryUsage = process.memoryUsage().rss / 1024 / 1024

            const maxConnections = numCores * 100; // realistic hơn

            console.log(`Active connections: ${numConnections}`);
            console.log(`Memory Usage: ${memoryUsage.toFixed(2)} MB`);

            if (numConnections > maxConnections) {
                console.log("🚨 Connection overload detected!");
            }

        } catch (error) {
            console.error("Error checking overload:", error);
        }
    }, _SECOND);
}
export {
    countConnect,
    checkOverLoad
} 