const express = require('express')

// Валидация поступающих данных
const { body } = require('express-validator/check')

const feedController = require('../controllers/feed')

const router = express.Router()

// Получить все посты GET /feed/posts
router.get('/posts', feedController.getPosts)

// Создать пост POST /feed/post
router.post('/post', [
	body('title').trim().isLength({ min: 5 }), 
	body('content').trim().isLength({ min: 5 })
], feedController.createPost)

module.exports = router
