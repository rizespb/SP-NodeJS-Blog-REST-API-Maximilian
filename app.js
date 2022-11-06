const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const feedRoutes = require('./routes/feed')

const app = express()

// Для парсинга данных из форм
// app.use(bodyParser.urlencoded()) // x-www-form-urlencoded

// Для парсинга json-данных
app.use(bodyParser.json())

// Настройка CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  // Клиент может отсылать, помимо стандартных заголовков, еще заголовки 'Content-Type, Authorization'
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  next()
})

app.use('/feed', feedRoutes)

mongoose
  .connect('mongodb+srv://testuser:testpassword@cluster0.qowv7.mongodb.net/blog?retryWrites=true&w=majority')
  .then((result) => {
    app.listen(8080)
  })
  .catch((err) => console.log('Error from app.js mongoose.connect: ', err))
