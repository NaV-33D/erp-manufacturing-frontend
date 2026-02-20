import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { CheckCircle2, Info, XCircle, X, AlertCircle } from "lucide-react";

const ToastContext = createContext(null);

const icons = {
  success: <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />,
  error: <XCircle size={20} className="text-red-500 flex-shrink-0" />,
  info: <Info size={20} className="text-blue-500 flex-shrink-0" />,
  warning: <AlertCircle size={20} className="text-amber-500 flex-shrink-0" />,
};

const backgrounds = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  info: "bg-blue-50 border-blue-200",
  warning: "bg-amber-50 border-amber-200",
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (type, message, opts = {}) => {
      const id = `${Date.now()}-${Math.random()}`;
      const duration = opts.duration ?? 3000;

      setToasts((prev) => [...prev, { id, type, message, duration }]);

      window.setTimeout(() => remove(id), duration);
    },
    [remove],
  );

  const api = useMemo(
    () => ({
      success: (msg, opts) => show("success", msg, opts),
      error: (msg, opts) => show("error", msg, opts),
      info: (msg, opts) => show("info", msg, opts),
      warning: (msg, opts) => show("warning", msg, opts),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* Toast stack */}
      <div className="fixed top-4 right-4 z-[10000] space-y-3 w-[360px] max-w-[calc(100vw-2rem)] pointer-events-none">
        {toasts.map((t, index) => (
          <div
            key={t.id}
            className="pointer-events-auto animate-[slideIn_0.3s_ease-out,fadeIn_0.3s_ease-out]"
            style={{
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <div
              className={`
                ${backgrounds[t.type] || backgrounds.info}
                relative border shadow-lg rounded-xl p-4 flex items-start gap-3
                backdrop-blur-sm
                transition-all duration-200 hover:shadow-xl hover:scale-[1.02]
              `}
            >
              {/* Loading / time progress bar */}
              <div className="absolute left-0 top-0 h-[3px] w-full overflow-hidden rounded-t-xl">
                <div
                  className={`h-full ${
                    t.type === "success"
                      ? "bg-green-500"
                      : t.type === "error"
                        ? "bg-red-500"
                        : t.type === "warning"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                  }`}
                  style={{
                    animation: `toastProgress ${t.duration}ms linear forwards`,
                  }}
                />
              </div>

              <div className="mt-0.5">{icons[t.type] || icons.info}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 leading-relaxed">
                  {t.message}
                </div>
              </div>
              <button
                onClick={() => remove(t.id)}
                className="text-gray-400 hover:text-gray-700 transition-colors duration-150 flex-shrink-0 hover:bg-white/50 rounded-md p-1"
                type="button"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes toastProgress {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0%);
          }
        }

      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider />");
  return ctx;
};
