import React from 'react';
import { Task } from '../../types';
import { formatDate, getPriorityColor, getStatusColor, isOverdue, truncateText } from '../../utils/helpers';
import { useAuth } from '../../contexts/AuthContext';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const { user } = useAuth();
  const priorityColor = getPriorityColor(task.priority);
  const statusColor = getStatusColor(task.status);
  const overdue = isOverdue(task.dueDate) && !task.isCompleted;

  // Check if current user can edit/delete/toggle this task
  const isCreator = task.createdBy === user?.id;
  const isAssignee = task.assignedTo === user?.id;
  const isAdmin = user?.role === 'admin';

  // Permissions
  const canEdit = isCreator || isAssignee || isAdmin;
  const canDelete = isCreator || isAdmin;
  const canToggle = isCreator || isAssignee || isAdmin;

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all transform hover:scale-105 shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => canToggle && onToggleComplete(task.id)}
            disabled={!canToggle}
            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              task.isCompleted
                ? 'bg-green-500 border-green-500'
                : canToggle
                ? 'border-gray-600 hover:border-purple-500 cursor-pointer'
                : 'border-gray-600 cursor-not-allowed opacity-50'
            }`}
            title={!canToggle ? 'You do not have permission to toggle this task' : ''}
          >
            {task.isCompleted && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${task.isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-gray-400 text-sm mt-1">{truncateText(task.description, 100)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: priorityColor }}
        >
          {task.priority.toUpperCase()}
        </span>
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: statusColor }}
        >
          {task.status.toUpperCase().replace('-', ' ')}
        </span>
        {overdue && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
            OVERDUE
          </span>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center text-gray-400">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Created by: {task.creator.name}</span>
        </div>
        {task.dueDate && (
          <div className="flex items-center text-gray-400">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={overdue ? 'text-red-400 font-semibold' : ''}>
              Due: {formatDate(task.dueDate)}
            </span>
          </div>
        )}
        {task.assignee && (
          <div className="flex items-center text-gray-400">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Assigned to: {task.assignee.name}</span>
          </div>
        )}
      </div>

      {/* Actions - Only show if user has permissions */}
      {(canEdit || canDelete) && (
        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-700">
          {canEdit && (
            <button
              onClick={() => onEdit(task)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
      )}

      {/* Permission indicator - show if user cannot perform any action */}
      {!canEdit && !canDelete && !canToggle && (
        <div className="pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 italic text-center">View only - No edit permissions</p>
        </div>
      )}
    </div>
  );
};

export default TaskCard;