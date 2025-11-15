import { Check } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

export const SuccessModal = ({
  isOpen,
  onClose,
  title = 'Berhasil Ditambah!',
  message = 'Produk baru berhasil disimpan dan sekarang muncul di daftar produk.',
  buttonText = 'Tutup',
}: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
            <Check size={28} className="text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>

        {/* Message */}
        <p className="text-gray-500 mb-8">{message}</p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-white border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
