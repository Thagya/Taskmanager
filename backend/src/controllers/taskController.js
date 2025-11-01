const Task = require('../models/Task');
const User = require('../models/User');
const { Op } = require('sequelize');

// @desc    Get all tasks with filters
// @route   GET /api/tasks
// @access  Private
exports.getAllTasks = async (req, res, next) => {
  try {
    const { 
      status, 
      priority, 
      isCompleted, 
      assignedTo, 
      createdBy,
      search,
      sortBy = 'createdAt',
      order = 'DESC'
    } = req.query;

    const whereClause = {};

    // Filter by status
    if (status) {
      whereClause.status = status;
    }

    // Filter by priority
    if (priority) {
      whereClause.priority = priority;
    }

    // Filter by completion status
    if (isCompleted !== undefined) {
      whereClause.isCompleted = isCompleted === 'true';
    }

    // Filter by assigned user
    if (assignedTo) {
      whereClause.assignedTo = assignedTo;
    }

    // Filter by creator
    if (createdBy) {
      whereClause.createdBy = createdBy;
    }

    // Search in title and description
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [[sortBy, order.toUpperCase()]]
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    // Verify assigned user exists if provided
    if (assignedTo) {
      const assignee = await User.findByPk(assignedTo);
      if (!assignee) {
        return res.status(404).json({
          success: false,
          message: 'Assigned user not found'
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate,
      assignedTo,
      createdBy: req.user.id
    });

    // Fetch task with associations
    const taskWithAssociations = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: taskWithAssociations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private (Only creator, assignee, or admin)
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has permission to update this task
    const isCreator = task.createdBy === req.user.id;
    const isAssignee = task.assignedTo === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAssignee && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    const { title, description, status, priority, dueDate, assignedTo, isCompleted } = req.body;

    // Verify assigned user exists if provided
    if (assignedTo) {
      const assignee = await User.findByPk(assignedTo);
      if (!assignee) {
        return res.status(404).json({
          success: false,
          message: 'Assigned user not found'
        });
      }
    }

    const fieldsToUpdate = {};
    if (title !== undefined) fieldsToUpdate.title = title;
    if (description !== undefined) fieldsToUpdate.description = description;
    if (status !== undefined) fieldsToUpdate.status = status;
    if (priority !== undefined) fieldsToUpdate.priority = priority;
    if (dueDate !== undefined) fieldsToUpdate.dueDate = dueDate;
    if (assignedTo !== undefined) fieldsToUpdate.assignedTo = assignedTo;
    if (isCompleted !== undefined) fieldsToUpdate.isCompleted = isCompleted;

    await task.update(fieldsToUpdate);

    // Fetch updated task with associations
    const updatedTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Only creator or admin)
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is the creator or admin
    if (task.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task. Only the task creator or admin can delete tasks.'
      });
    }

    await task.destroy();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/toggle-complete
// @access  Private (Only creator, assignee, or admin)
exports.toggleTaskCompletion = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has permission to toggle completion
    const isCreator = task.createdBy === req.user.id;
    const isAssignee = task.assignedTo === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAssignee && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task. Only the creator, assignee, or admin can change task status.'
      });
    }

    task.isCompleted = !task.isCompleted;
    await task.save();

    // Fetch updated task with associations
    const updatedTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.isCompleted ? 'completed' : 'incomplete'}`,
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
exports.getTaskStats = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.user.id;

    const whereClause = req.user.role === 'admin' ? {} : { 
      [Op.or]: [
        { createdBy: userId },
        { assignedTo: userId }
      ]
    };

    const totalTasks = await Task.count({ where: whereClause });
    const completedTasks = await Task.count({ 
      where: { ...whereClause, isCompleted: true } 
    });
    const pendingTasks = await Task.count({ 
      where: { ...whereClause, status: 'pending' } 
    });
    const inProgressTasks = await Task.count({ 
      where: { ...whereClause, status: 'in-progress' } 
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks
      }
    });
  } catch (error) {
    next(error);
  }
};