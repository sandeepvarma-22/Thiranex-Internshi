import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toast-notifications">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`toast ${
              isSuccess ? 'toast-success' : isError ? 'toast-error' : 'toast-info'
            }`}
          >
            {isSuccess && <CheckCircle2 className="toast-icon-success" size={20} />}
            {isError && <AlertCircle className="toast-icon-error" size={20} />}
            {!isSuccess && !isError && <Info className="toast-icon-info" size={20} />}

            <div className="toast-message">{toast.message}</div>

            <button
              type="button"
              className="btn-icon"
              style={{ padding: '4px', marginLeft: '6px' }}
              onClick={() => onDismiss(toast.id)}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
