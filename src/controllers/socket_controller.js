// socket.js
const { Server } = require('socket.io');
const http = require('http');
const { checkToken } = require('../middleware/verifyRequest');
const { Conversation } = require('../Models/Conversation');
const { fnGet, fnbulkCreate, fnPost } = require('../utils/dbCommonfn');
const { Participate } = require('../Models/Participant');
const { Message } = require('../Models/Message');
const { Op, Sequelize } = require('sequelize');
const TryCatch = require('../utils/TryCatchHelper');
const { getCurrentFormatedDate } = require('../utils/functionalHelper');
const CustomErrorObj = require('../error/CustomErrorObj');

const createSocket = (app) => {
    console.log('started the socket');
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.engine.use((req, res, next) => {
        const isHandshake = req._query.sid === undefined;
        if (!isHandshake) {
            return next();
        }
        else {
            checkToken(req, res, next)
        }
        // checkToken(req,res)
    });

    io.on('connection', (socket) => {
        const { email, id } = socket.handshake.query;
        if (!email || !id) {
            return ({
                message: 'Invalid Request',
                statusCode: 400
            })
        }
        console.log('A client connected.', id, email);
        socket.join(email);

        socket.broadcast.emit("join", `${email} has joined the server`);

        socket.on("send_chat_message", async (obj) => {

            const { sender_id, receiver_id, message, email, conversation_id } = obj;
            if (!conversation_id) {
                await fnPost(Conversation, {
                    startdate: getCurrentFormatedDate(),
                    isEnded: false,
                    participate: [
                        {
                            user_id: sender_id
                        }, {
                            user_id: receiver_id
                        }
                    ],
                    messages: {
                        sender_id,
                        message,
                        timestamp: getCurrentFormatedDate(),
                        status: 'send'
                    }
                },)
            }
            else {
                await fnPost(Message, {
                    sender_id,
                    message,
                    conversation_id,
                    timestamp: getCurrentFormatedDate(),
                    status: 'send'
                })
            }
            console.log(obj, 'chat message hit');
            // await fnbulkMessagePost(obj);
            socket.broadcast.to(email).emit("receive_chat_message", {
                sender_id,
                message,
                ...(conversation_id && conversation_id),
                timestamp: getCurrentFormatedDate(),
                status: 'send'
            }
            );
        });

        socket.on('action_message', async (obj) => {
            let { action, id } = obj;
            let message_arr = [];
            if (action == 'update') {
                message_arr.push({
                    id, status: "read"
                })
                await fnbulkMessageUpdate(message_arr);
            }
            else if (action == 'delete') {
                message_arr.push({
                    id, status: "delete"
                })
                await fnbulkMessageUpdate(message_arr);
            }
        })

        socket.on('get_message', async (x) => {
            let { id, email } = x;
            let { data: messages } = await fnGet(Participate, { user_id: id }, {
                include: [
                    {
                        model: Message,
                        where: {
                            conversation_id: Sequelize.col('Participate.conversation_id')
                        }
                    }
                ]
            })
            console.log(messages, 'messages');

            socket.broadcast.to(email).emit('message_history', messages)
        })
        socket.on('disconnect', () => {
            console.log('A client disconnected.', socket.id);
        });
    });
    io.engine.on("connection_error", (err) => {
        console.log(err.code, err.message, 'error in connecting')
        // socket.emit('error', err);
    });
    return { io, server };
};
const fnbulkMessageUpdate = TryCatch(async (arr) => {
    await fnbulkCreate(Message, arr, ['status'], [], req);
}
)
const fnbulkMessagePost = TryCatch((arr) => {

}
)
const fnbulkMessageDelete = TryCatch((arr) => {

}
)


module.exports = createSocket;
