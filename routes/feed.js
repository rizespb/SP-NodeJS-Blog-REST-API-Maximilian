const express = require('express')

const feedController = require('../controllers/feed')

const router = express.Router()

// Получить все посты GET /feed/posts
router.get('/posts', feedController.getPosts)

// Создать пост POST /feed/post
router.post('/post', feedController.createPost)

module.exports = router
