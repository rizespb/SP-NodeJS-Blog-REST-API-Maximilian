// Валидация
const { validationResult } = require('express-validator/check')

// Хэширование пароля
const bcrypt = require('bcryptjs')

const User = require('../models/user')

exports.signup = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed')
    error.statusCode = 422
    error.data = errors.array()
    throw error
  }

  const email = req.body.email
  const name = req.body.name
  const password = req.body.password

  // 12 - salt
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
      })

      return user.save()
    })
    .then((result) => {
      res.status(201).json({
        message: 'User created',
        userId: result._id,
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      console.log('Error from signup bcrypt.hash: ', err)

      // Пробрасываем ошибку, чтобы сработал глобальный Error Handler в app.js
      next(err)
    })
}
