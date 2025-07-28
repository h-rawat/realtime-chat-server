const rfs = require('rotating-file-stream')
const path = require('path')

const logStream = rfs.createStream('chat.log', {
    size: '10M', // rotate every 10 MBs
    interval: '1d',
    path: path.join(__dirname, 'logs')
})

module.exports = logStream