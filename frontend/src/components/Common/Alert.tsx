import React from 'react';
import { AlertType } from '../../types';

interface AlertProps {
  alert: AlertType;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ alert, onClose }) => {
  const getAlertStyles = () => {
    switch (alert.type) {
      case 'success':
        return 'bg-green-900 border-green-500 text-green-100';
      case 'error':
        return 'bg-red-900 border-red-500 text-red-100';
      case 'warning':
        return 'bg-yellow-900 border-yellow-500 text-yellow-100';
      case 'info':
        return 'bg-blue-900 border-blue-500 text-blue-100';
      default:
        return 'bg-gray-800 border-gray-600 text-gray-100';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border-l-4 shadow-lg max-w-md animate-slide-in ${getAlertStyles()}`}>
      <div className="flex items-start justify-between">
        <p className="flex-1 pr-4">{alert.message}</p>
        <button
          onClick={onClose}
          className="text-white hover:opacity-75 transition-opacity font-bold text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Alert;