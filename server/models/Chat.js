// This file defines our schema and model interface for the Chat data.
const mongoose = require('mongoose');

/* Our schema defines the data we will store. */
const ChatSchema = new mongoose.Schema({
  createdDate: {
    type: Date,
    unique: false,
    default: Date.now,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
    unique: false,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: false,
    ref: 'Account',
  },
  color: {
    type: String,
    unique: false,
    default: 'black',
  },
  room: {
    type: String,
    unique: false,
    default: 'General',
  },
  message: {
    type: String,
    unique: false,
    required: true,
  },
});

// Converts a doc to something we can store in redis later on.
ChatSchema.statics.toAPI = (doc) => ({
  username: doc.userName,
  userId: doc.userId,
  _id: doc._id,
  color: doc.color,
  room: doc.room,
  createdDate: doc.createdDate,
});

const ChatModel = mongoose.model('Chat', ChatSchema);
module.exports = ChatModel;
