import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '2xl',
  showCloseButton = true,
}: ModalProps) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className={`bg-white rounded-lg ${maxWidthClasses[maxWidth]} w-full my-8`}>
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-6 border-b">
            <div className="flex-1">
              {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
              {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-4 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X size={24} />
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div>{children}</div>
      </div>
    </div>
  );
};
