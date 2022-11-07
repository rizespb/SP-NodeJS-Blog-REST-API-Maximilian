// Валидация
const { validationResult } = require('express-validator/check')

const Post = require('../models/post')

// Получить посты
exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: 'Fetched posts successfully',
        posts: posts,
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      console.log('Error from getPosts Post.find(): ', err)

      // Пробрасываем ошибку, чтобы сработал глобальный Error Handler в app.js
      next(err)
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
    imageUrl: 'images/boat.jpg',
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

// Получение отдельного поста
exports.getPost = (req, res, next) => {
  const postId = req.params.postId

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post')
        error.statusCode = 404

        // Ошибка попадает в catch, а catch прокинет ее в обработчик ошибок next(err)
        throw error
      }

      res.status(200).json({
        message: 'Post fetched',
        post: post,
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      console.log('Error from getPost Post.findById(): ', err)

      // Пробрасываем ошибку, чтобы сработал глобальный Error Handler в app.js
      next(err)
    })
}
