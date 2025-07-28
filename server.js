
const cluster = require('cluster')
const os = require('os')

if (cluster.isMaster) {
    const numCPUs = os.cpus().length
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => cluster.fork())
} else {
    const express = require('express')
    const http = require('http')
    const WebSocket = require('ws')
    const fs = require('fs')
    const path = require('path')
    const logStream = require('./logger')

    const logDir = path.join(__dirname, 'logs')
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir)
    }

    const app = express()
    const server = http.createServer(app)
    const wss = new WebSocket.Server({ server })
    const PORT = 3000

    wss.on('connection', ws => {
        ws.on('message', message => {
            logStream.write(`${new Date().toISOString()} ${message}\n`)

            // broadcast to all clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message.toString())
                }
            })
        })
    })

    server.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`)
    })
}

