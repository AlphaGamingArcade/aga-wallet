require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

// routes
const usersRoutes = require('./routes/usersRoutes')
const validatorsRoutes = require('./routes/validatorsRoutes')
const walletsRoutes = require('./routes/walletsRoutes')
const transactionsRoutes = require('./routes/transactionsRoutes')
const pushNotificationsRoutes = require('./routes/pushNotificationsRoutes')
const blockchainRoutes = require('./routes/blockchainRoutes')

// middlewares
app.use(express.json())
app.use(cors({ origin: true }))
app.use('/api/users', usersRoutes)
app.use('/api/validators', validatorsRoutes)
app.use('/api/wallets', walletsRoutes)
app.use('/api/transactions', transactionsRoutes)
app.use('/api/push-notifications', pushNotificationsRoutes)
app.use('/api/blockchain', blockchainRoutes)

let rooms = {}
io.of('/wallet').on('connection', (socket) => {
    socket.on('setUserID', (data) => {
        socket.userID = data.userID

        const userID = data.userID
        const roomName = `${userID}`

        rooms[userID] = roomName
        socket.join(roomName)
    })

    socket.on('disconnect', () => {
        const userID = socket.userID
        if (userID) {
            if (rooms[userID]) {
                const roomName = rooms[userID]
                delete rooms[userID]
                io.emit('deleteRoom', { userId: userID, roomName: roomName })
            }
        }
    })

    socket.on('deleteRoom', (data) => {})

    socket.on('new-block-added', (data) => {})
})

io.of('/blockchain').on('connection', (socket) => {
    socket.on('block-notify', (data) => {
        console.log(data)
    })
})

server.listen(process.env.PORT, process.env.IP, async () => {
    console.clear()
    console.log(`Listen at port`, process.env.PORT)
})
