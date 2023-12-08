/* If you haven't, take a look at the basic-socket-io-done
   demo on GitHub before reading this one. This demo assumes
   you know basic socket.io concepts.

   https://github.com/IGM-RichMedia-at-RIT/basic-socket-io-done

   Before reading more of this file, check out client.js in this
   project.
*/

const http = require('http');
const { Server } = require('socket.io');

let io;

/* Our io server is responsible for handling what "channel" each
   person (socket) is in. Socket.io has a built in system for
   this called "rooms". https://socket.io/docs/v4/rooms/

   A socket is aware of all the rooms it is currently in. When
   we recieve a chat message from a client, we will call
   handleChatMessage and pass in the socket and the text. We
   then ask the socket what rooms it's in, and emit the message
   to all of those rooms.

   The basic-socket demo used io.emit() to do this. The issue
   with io.emit() is that it sends the event to *everyone* connected
   to the server regardless of if they will do anything with the
   message or not. That is a lot of wasted work, and a potentially
   huge security issue.

   io.to(room).emit() instead only emits to people in that specific
   room.
*/
const handleChatMessage = (socket, msg) => {
  socket.rooms.forEach((room) => {
    /* Every socket has a socket.id which is a unique identifier
           generated by the library when they connect to the server.
           They are also put in a room with themselves, whose name
           is the same as their ID. For this, we want to ignore that
           room, so we will skip over it.
        */
    if (room === socket.id) return;
    io.to(room).emit('chat message', {
      color: socket.request.session.account.color,
      userName: socket.request.session.account.username,
      message: msg.message,
    });
  });
};

/* When handleRoomChange is called, we want to remove that socket
   from all rooms (except its personal ID room), then add them to
   the new one. The code below does that.

   Be aware that in a different sort of application, you might
   not want to remove a user from all it's existing rooms when it
   gets added to another. This would be a case-by-case sort of thing.
*/
const handleRoomChange = (socket, roomName) => {
  socket.rooms.forEach((room) => {
    if (room === socket.id) return;
    socket.leave(room);
  });
  socket.join(roomName);
};

const socketSetup = (app, sessionMiddleware) => {
  const server = http.createServer(app);
  io = new Server(server);
  io.engine.use(sessionMiddleware);

  io.on('connection', (socket) => {
    console.log('a user connected');

    /* Here we automatically put all new users into the general room. */
    socket.join('general');

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    /* We need to pass down the current socket into each of these
           handler functions. Be aware that we can't globalize socket
           in this file otherwise it will be overwritten each time a
           new user connects. It is easier and far safer to simply pass
           it down into our handler functions in this way.
        */
    socket.on('chat message', (msg) => handleChatMessage(socket, msg));
    socket.on('room change', (room) => handleRoomChange(socket, room));
  });

  return server;
};

module.exports = socketSetup;
