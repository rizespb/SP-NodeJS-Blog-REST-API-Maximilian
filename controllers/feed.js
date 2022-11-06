// Валидация
const { validationResult } = require('express-validator/check')

const Post = require('../models/post')

// Получить посты
exports.getPosts = (req, res, next) => {
  res.json({
    posts: [
      {
        _id: '1',
        title: 'First Post',
        content: 'This is the first post!',
        imageUrl: 'images/boat.jpg',
        creator: {
          name: 'Ivan',
        },
        createdAt: new Date().toLocaleString(),
      },
    ],
  })
}

// Создать новый пост
exports.createPost = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect')
    error.statusCode = 422

    throw error
  }

  const title = req.body.title
  const content = req.body.content

  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/boat.js',
    creator: {
      name: 'Ivan',
    },
  })

  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: result,
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      console.log('Error from createPost post.save(): ', err)

      // Пробрасываем ошибку, чтобы сработал глобальный Error Handler в app.js
      next(err)
    })
}
