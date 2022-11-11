const express = require('express')

// Валидация поступающих данных
const { body } = require('express-validator/check')

const feedController = require('../controllers/feed')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

// Получить все посты GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts)

// Создать пост POST /feed/post
router.post('/post', [body('title').trim().isLength({ min: 5 }), body('content').trim().isLength({ min: 5 })], feedController.createPost)

// Получить пост GET /feed/post/:postId
router.get('/post/:postId', feedController.getPost)

// Обновить пост PUT /feed/post/:postId
router.put('/post/:postId', [body('title').trim().isLength({ min: 5 }), body('content').trim().isLength({ min: 5 })], feedController.updatePost)

// Удалить пост DELETE /feed/post/:postId
router.delete('/post/:postId', feedController.deletePost)

module.exports = router
