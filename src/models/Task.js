const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Title is required' },
      len: { args: [3, 200], msg: 'Title must be between 3 and 200 characters' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  timestamps: true,
  hooks: {
    beforeUpdate: (task) => {
      if (task.changed('isCompleted') && task.isCompleted) {
        task.completedAt = new Date();
        task.status = 'completed';
      }
      if (task.changed('isCompleted') && !task.isCompleted) {
        task.completedAt = null;
      }
    }
  }
});

// Define associations
Task.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });

User.hasMany(Task, { as: 'createdTasks', foreignKey: 'createdBy' });
User.hasMany(Task, { as: 'assignedTasks', foreignKey: 'assignedTo' });

module.exports = Task;