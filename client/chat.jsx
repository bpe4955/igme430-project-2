const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const socket = io();

let chatFocused = false;

// Sends the message data to the server
// Uses fetch to send a postRequest. Marksed as async because we use await within it.
const sendMessagePost = async (msg) => {
  //Make a fetch request and await a response. Set the method to
  //the one provided by the form (POST). Set the headers. Content-Type
  //is the type of data we are sending. Accept is the data we would like
  //in response. Then add our FORM-URLENCODED string as the body of the request.
  const response = await fetch("/sendMessage", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(msg),
  });
  const data = await response.json();


  //Once we have a response, handle it.
  //handleResponse(response);

};

const initMessageBox = () => {
  const editForm = document.querySelector('#messageForm');
  const editBox = document.querySelector('#messageField');

  if (!sessionStorage.getItem('color')) {
    helper.sendGet('/getUserColor', (result) => {
      sessionStorage.setItem('color', result.color);
    });
  }
  if (!sessionStorage.getItem('_id')) {
    helper.sendGet('/getUserId', (result) => {
      sessionStorage.setItem('_id', result._id);
    });
  }
  if (!sessionStorage.getItem('userName')) {
    helper.sendGet('/getUserName', (result) => {
      sessionStorage.setItem('userName', result.username);
    });
  }

  // Submit message
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (editBox.value) {
     const msg = {
        message: editBox.value,
        color: sessionStorage.getItem('color'),
        userName: sessionStorage.getItem('userName'),
        userId: sessionStorage.getItem('_id'),
        room: sessionStorage.getItem('room'),
     }
     await sendMessagePost(msg);
      socket.emit('chat message', msg);
      editBox.value = '';
    }

    return false;
  });
};

const initChannelSelect = async () => {
  const channelSelect = document.getElementById('channelSelect');
  const messages = document.getElementById('chat');

  channelSelect.addEventListener('change', () => {
    sessionStorage.setItem('room',channelSelect.value);
    messages.innerHTML = `<p id="title-message">NON-PICTORAL CHAT: ${channelSelect.value[0].toUpperCase() + channelSelect.value.substring(1)}</p>`;
    socket.emit('room change', channelSelect.value);
    requestInitialMessages();
  });

  channelSelect.value = sessionStorage.getItem('room');
}

const Message = (props) => {
  const userClassList = `user-name user-${props.msg.color}`;
  const messageClassList = `user-message message-${props.msg.color}`;
  return (
    <div className="chat-message">
      <p className={userClassList}>{props.msg.userName}:</p>
      <p className={messageClassList}>{props.msg.message}</p>
    </div>
  );
}

const displayMessage = (msgData) => {
  const messageDiv = document.createElement('div');
  ReactDOM.render(<Message msg={msgData} />, messageDiv);
  document.querySelector('#chat').appendChild(messageDiv);
}

const requestInitialMessages = async () => {
  const response = await fetch(`/getMessages?room=${sessionStorage.getItem('room')}`);
  const data = await response.json();
  data.messages.forEach(msg => {
    displayMessage(msg);
  });
}

// Init function is called when window.onload runs (set below).
// Set up connections and events
const init = () => {
  if(!sessionStorage.getItem('room')) {sessionStorage.setItem('room', 'general');}
  // Get past messages
  requestInitialMessages();

  // Scrolling the chat messages
  document.querySelector("#chat").addEventListener('mouseenter', () => { chatFocused = true; });
  document.querySelector("#chat").addEventListener('mouseleave', () => { chatFocused = false; });

  //Socket io
  initMessageBox();
  initChannelSelect();
  socket.on('chat message', displayMessage);
  document.querySelector('#title-message').textContent = `NON-PICTORAL CHAT: ${channelSelect.value[0].toUpperCase() + channelSelect.value.substring(1)}`;
};

//When the window loads, run init.
window.onload = init;