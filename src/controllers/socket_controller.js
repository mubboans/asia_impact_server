// socket.js
const { Server } = require('socket.io');
const http = require('http');
const { checkToken } = require('../middleware/verifyRequest');
const { Conversation } = require('../Models/Conversation');
const { fnGet, fnbulkCreate, fnPost, fnUpdate } = require('../utils/dbCommonfn');
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
        let messageBuffer = [];
        const BUFFER_LIMIT = 100;
        const POST_INTERVAL = 60000;

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
            // let messageArr = []
            const { sender_id, receiver_id, message, email, conversation_id } = obj;
            if (!conversation_id && sender_id && receiver_id && message) {
                messageBuffer.push(fnPost(Conversation, {
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
                }, {
                    include: [
                        { model: Participate, as: 'participate' },
                        { model: Message, as: 'messages' }
                    ]
                })
                )
            }
            else {
                messageBuffer.push(
                    fnPost(Message, {
                        sender_id,
                        message,
                        conversation_id,
                        timestamp: getCurrentFormatedDate(),
                        status: 'send'
                    }, []
                    ))
                // await fnPost(Message,{
                //     sender_id,
                //     message,
                //     conversation_id,
                //     timestamp: getCurrentFormatedDate(),
                //     status: 'send'
                // },[],req)
            }
            console.log(obj, 'chat message hit');
            if (messageBuffer.length >= BUFFER_LIMIT) {
                await fnbulkMessagePost(messageBuffer)
                messageBuffer = []
            }
            createonInterval();
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
            console.log('enter on action_message');
            if (id && action) {
                if (action == 'update') {
                    messageBuffer.push(fnUpdate(Message, {
                        id, status: "read"
                    }, { id })
                    )
                    // await fnbulkMessageUpdate(message_arr);
                }
                else if (action == 'delete') {
                    messageBuffer.push(fnUpdate(Message, {
                        id, status: "delete"
                    }, { id })
                    )
                }
            }
            if (messageBuffer.length > BUFFER_LIMIT) {
                await fnbulkMessageUpdate(messageBuffer);
                messageBuffer = []
            }
            createonInterval();
        })

        socket.on('get_message', async (x) => {
            let { id, email } = x;
            if (id && email) {
                let { data: messages } = await fnGet(Participate, { user_id: id },
                    [
                        {
                            model: Conversation,
                            include: [
                                {
                                    model: Message,
                                    sourceKey: "conversation_id",
                                    //   where: {
                                    //     timestamp: {
                                    //       [Sequelize.Op.gt]: Sequelize.col('Participate.last_read_timestamp')
                                    //     }
                                    //   }
                                    as: 'messages'
                                }
                            ],
                            sourceKey: "conversation_id",
                            as: 'conversation'
                        }
                    ]
                )
                console.log(messages, 'messages');
                io.to(email).emit('message_history', messages)
            }

        })
        socket.on('disconnect', () => {
            console.log('A client disconnected.', socket.id);
        });
        const createonInterval = () => setInterval(async () => {
            console.log(messageBuffer.length, 'messageBuffer.length check');
            if (messageBuffer.length > 0) {
                await fnbulkMessagePost(messageBuffer)
                messageBuffer = []
                console.log('inside fnbulkMessagePost');
            }
            console.log('interval hit ');
        }, POST_INTERVAL)

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
const fnbulkMessagePost = TryCatch(async (arr) => {
    await Promise.all(arr);
    return [];
    //  fnbulkCreate(Message, arr, [], [], req);
}
)
// const fnbulkMessageDelete = TryCatch((arr) => {

// }
// )


module.exports = createSocket;
