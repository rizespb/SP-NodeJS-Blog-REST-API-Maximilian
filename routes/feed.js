const express = require('express')

const feedController = require('../controllers/feed')

const router = express.Router()

// Получить все посты
router.get('/posts', feedController.getPosts)

module.exports = router
