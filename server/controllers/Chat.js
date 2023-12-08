// const { contentSecurityPolicy } = require('helmet');
// const models = require('../models');
const models = require('../models');

const { Chat } = models;

const chatPage = async (req, res) => res.render('app', {
  userName: req.session.account.username,
  color: req.session.account.color,
  chatRoom: 'General',
});

const getMessages = async (req, res) => {
  try {
    const query = {
      room: req.session.account.room,
      /* , createdDate: { $gts: req.session.account.createdDate, } */ };
    const docs = await Chat.find(query).sort({ createdDate: -1 }).limit(25).lean()
      .exec();
    // .select('user message color');
    return res.json({ messages: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving messages!' });
  }
};

// function to add a message from a POST body
const sendMessage = async (req, res) => {
  // default json message
  const responseJSON = {
    message: 'Name, Color, and Message are required.',
  };

  // If the post request is empty
  if (!req.body) {
    responseJSON.message = 'No body sent with POST request';
    responseJSON.id = 'noBodySent';
    return res.status(501).json(responseJSON);
  }

  // If something is missing, send back an error message as a 400 badRequest
  if (!req.session.account.username || !req.session.account.color || !req.body.message) {
    responseJSON.id = 'missingParams';
    return res.status(400).json(responseJSON);
  }

  const msg = {
    userName: String(req.session.account.username),
    userId: req.session.account._id,
    color: req.session.account.color,
    room: req.session.account.room,
    message: req.body.message,
  };
  const chat = new Chat(msg);

  try {
    await chat.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Chat message couldn't save" });
  }
  return res.status(201).json({ message: 'Chat message successfully saved' });
};

module.exports = {
  chatPage,
  sendMessage,
  getMessages,
};
