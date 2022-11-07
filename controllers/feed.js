const fs = require('fs')
const path = require('path')

// Валидация
const { validationResult } = require('express-validator/check')

const Post = require('../models/post')

// Получить посты
exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1
  const perPage = 2
  let totalItems

  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count

      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
    })
    .then((posts) => {
      res.status(200).json({
        message: 'Fetched posts successfully',
        posts: posts,
        totalItems: totalItems,
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

  // Запрос должен содержать файл изоюражения для поста
  // В req.file его поместит Multer после парсинга body
  if (!req.file) {
    const error = new Error('No image provided')
    throw error
  }

  const imageUrl = req.file.path
  const title = req.body.title
  const content = req.body.content

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
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

// Обновление поста
exports.updatePost = (req, res, next) => {
  const postId = req.params.postId

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect')
    error.statusCode = 422

    throw error
  }

  const title = req.body.title
  const content = req.body.content
  let imageUrl = req.body.image

  // Если был загружен новый файл, тогда он будет в req.file
  if (req.file) {
    imageUrl = req.file.path
  }

  if (!imageUrl) {
    const error = new Error('No file picked')
    error.statusCode = 422
    throw error
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post')
        error.statusCode = 404

        // Ошибка попадает в catch, а catch прокинет ее в обработчик ошибок next(err)
        throw error
      }

      // Если новый путь к изображению не равен новому (изображение обновили), удаляем старое изображение с сервера
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl)
      }

      post.title = title
      post.imageUrl = imageUrl
      post.content = content

      return post.save()
    })
    .then((result) => {
      res.status(200).json({
        message: 'Post updated!',
        post: result,
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

// Удаление поста по ID
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post')
        error.statusCode = 404

        // Ошибка попадает в catch, а catch прокинет ее в обработчик ошибок next(err)
        throw error
      }

      // Check logged in user

      clearImage(post.imageUrl)

      return Post.findByIdAndRemove(postId)
    })
    .then((result) => {
      console.log(result)
      res.status(200).json({ message: 'Deleted post' })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      console.log('Error from deletePost Post.findById(): ', err)

      // Пробрасываем ошибку, чтобы сработал глобальный Error Handler в app.js
      next(err)
    })
}

// Удаление страого изображения в случае загрузки нового изображения пр иобновлении поста
const clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath)
  fs.unlink(filePath, (err) => {
    console.log('Error from clearImage: ', err)
  })
}
