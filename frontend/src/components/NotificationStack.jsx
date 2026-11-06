import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearNotification } from '../store/slices/notificationSlice';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const NotificationStack = () => {
  const dispatch = useDispatch();
  const stack = useSelector((state) => (state.notification && state.notification.stack) || []);

  if (!stack || stack.length === 0) {
    return null;
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="toast-icon toast-icon-success" size={18} />;
      case 'error':
        return <AlertCircle className="toast-icon toast-icon-error" size={18} />;
      case 'warning':
        return <AlertTriangle className="toast-icon toast-icon-warning" size={18} />;
      default:
        return <Info className="toast-icon toast-icon-info" size={18} />;
    }
  };

  return (
    <aside className="notification-stack-container" aria-live="polite" aria-label="System Notifications">
      {stack.map((item, idx) => (
        <div
          key={item.id || idx}
          className={`notification-toast toast-${item.type || 'info'}`}
          role="alert"
        >
          <div className="toast-content">
            {getIcon(item.type)}
            <span className="toast-message">{item.message}</span>
          </div>
          <button
            type="button"
            className="toast-dismiss-btn"
            onClick={() => dispatch(clearNotification(item.id))}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </aside>
  );
};

export default NotificationStack;
