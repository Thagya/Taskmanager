import React, { useEffect, useState } from 'react';
import { taskApi } from '../api/taskApi';
import { userApi } from '../api/userApi';
import { Task, TaskFilters as Filters, User, AlertType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import TaskList from '../components/Tasks/TaskList';
import TaskFilters from '../components/Tasks/TaskFilters';
import TaskForm from '../components/Tasks/TaskForm';
import Modal from '../components/Common/Modal';
import Alert from '../components/Common/Alert';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [alert, setAlert] = useState<AlertType | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskApi.getAllTasks(filters);
      if (response.data) {
        setTasks(response.data as unknown as Task[]);
      }
    } catch (error) {
      showAlert('error', 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userApi.getAllUsers();
      if (response.data) {
        setUsers(response.data as unknown as User[]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const showAlert = (type: AlertType['type'], message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task: Task) => {
    // Check if user has permission to edit
    const isCreator = task.createdBy === user?.id;
    const isAssignee = task.assignedTo === user?.id;
    const isAdmin = user?.role === 'admin';

    if (!isCreator && !isAssignee && !isAdmin) {
      showAlert('error', 'You do not have permission to edit this task');
      return;
    }

    setSelectedTask(task);
    setShowModal(true);
  };

  const handleSubmitTask = async (data: any) => {
    try {
      if (selectedTask) {
        await taskApi.updateTask(selectedTask.id, data);
        showAlert('success', 'Task updated successfully');
      } else {
        await taskApi.createTask(data);
        showAlert('success', 'Task created successfully');
      }
      setShowModal(false);
      fetchTasks();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Operation failed';
      if (error.response?.status === 403) {
        showAlert('error', 'Permission denied: ' + errorMessage);
        setShowModal(false);
      } else {
        throw error;
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    // Find the task to check permissions
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const isCreator = task.createdBy === user?.id;
    const isAdmin = user?.role === 'admin';

    if (!isCreator && !isAdmin) {
      showAlert('error', 'You do not have permission to delete this task. Only the creator or admin can delete tasks.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskApi.deleteTask(id);
      showAlert('success', 'Task deleted successfully');
      fetchTasks();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete task';
      showAlert('error', errorMessage);
    }
  };

  const handleToggleComplete = async (id: string) => {
    // Find the task to check permissions
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const isCreator = task.createdBy === user?.id;
    const isAssignee = task.assignedTo === user?.id;
    const isAdmin = user?.role === 'admin';

    if (!isCreator && !isAssignee && !isAdmin) {
      showAlert('error', 'You do not have permission to update this task. Only the creator, assignee, or admin can change task status.');
      return;
    }

    try {
      await taskApi.toggleTaskCompletion(id);
      showAlert('success', 'Task status updated');
      fetchTasks();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update task';
      showAlert('error', errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Tasks</h1>
          <p className="text-gray-400 mt-1">Manage and track your tasks</p>
        </div>
        <button
          onClick={handleCreateTask}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Task</span>
        </button>
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onFilterChange={setFilters} users={users} />

      {/* Tasks List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400">
              Showing <span className="text-white font-semibold">{tasks.length}</span> task(s)
            </p>
          </div>
          <TaskList
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
          />
        </>
      )}

      {/* Task Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedTask ? 'Edit Task' : 'Create New Task'}
        size="large"
      >
        <TaskForm
          task={selectedTask}
          users={users}
          onSubmit={handleSubmitTask}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      {/* Alert */}
      {alert && <Alert alert={alert} onClose={() => setAlert(null)} />}
    </div>
  );
};

export default Tasks;