export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return '#ef4444'; // red
    case 'medium':
      return '#f59e0b'; // orange
    case 'low':
      return '#10b981'; // green
    default:
      return '#6b7280'; // gray
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return '#10b981'; // green
    case 'in-progress':
      return '#3b82f6'; // blue
    case 'pending':
      return '#f59e0b'; // orange
    default:
      return '#6b7280'; // gray
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const isOverdue = (dueDate: string | undefined): boolean => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};