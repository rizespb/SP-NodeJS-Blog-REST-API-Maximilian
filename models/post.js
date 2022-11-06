const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: Object,
      required: true,
    },
  },
  // mongoose будет автоматически доавлять timestamp в коллекцию при добавлении или обновлении документа
  // поля createdAt и  updatedAt
  { timestamps: true }
)

// 
module.exports = mongoose.model('Post', postSchema)
