const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator
} = require('../validators/taskValidator');

// All routes are protected
router.use(protect);

// Stats route (before /:id to avoid conflict)
router.get('/stats', getTaskStats);

router.route('/')
  .get(getAllTasks)
  .post(createTaskValidator, createTask);

router.route('/:id')
  .get(taskIdValidator, getTask)
  .put(updateTaskValidator, updateTask)
  .delete(taskIdValidator, deleteTask);

router.patch('/:id/toggle-complete', taskIdValidator, toggleTaskCompletion);

module.exports = router;