# Realtime Chat Server

A Node.js-based realtime chat server using WebSocket, Express, and clustering for multi-core scalability. All chat messages are logged to `logs/chat.log`.

## Features
- Realtime message broadcasting to all connected clients
- Message logging to file
- Clustered for multi-core performance

## Project Structure
```
logger.js         # Logging utility
server.js         # Main server with clustering and WebSocket logic
logs/chat.log     # Chat message log file
```

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)

### Installation
```bash
npm install
```

### Running the Server
```bash
node server.js
```
The server will start on [http://localhost:3000](http://localhost:3000).

## Testing


### Basic Test
The code has been tested by commenting out the clustering part in `server.js`, allowing all clients to connect to a single process. Screenshots of the successful broadcast test are attached.

You can test the server by connecting multiple WebSocket clients (e.g., browser tabs or tools like [websocat](https://github.com/vi/websocat)).

#### Example using websocat:
```bash
websocat ws://localhost:3000
```
Type a message in one client; it should be broadcast to all others.

### Limitations Due to Clustering
Because the server uses Node.js clustering, each worker process manages its own set of WebSocket connections. **Message broadcasting only works within a single worker**—messages are not shared across all workers. This means clients connected to different workers will not receive each other's messages.

#### Why Can't We Test Broadcast Across All Clients?
- WebSocket connections are not shared between cluster workers.
- Broadcast only reaches clients connected to the same worker.

#### How to Fix This
To enable true cross-worker broadcasting, you can:
- Use an external pub/sub system (e.g., Redis) to share messages between workers.
- Implement inter-process communication (IPC) to forward messages between workers.

##### Example Solution: Redis Pub/Sub
1. Install `redis` and `ioredis`:
   ```bash
   npm install redis ioredis
   ```
2. Use Redis to publish messages from one worker and subscribe in all workers, broadcasting received messages to their clients.

## License
MIT
