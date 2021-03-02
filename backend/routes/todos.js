const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const TodosController = require('../controllers/todos')

router.post('', checkAuth , TodosController.createTodo)

router.put('/:id', checkAuth , TodosController.updateTodo)

router.get('', TodosController.getTodos)

router.get('/:id', TodosController.getTodo)

router.put('/toggle/:postid',checkAuth, TodosController.toggleDone)

router.delete('/:id',checkAuth, TodosController.deleteTodo)

module.exports = router