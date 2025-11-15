import { Pencil, Check, X as XIcon } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import type { User } from '@/types/user.types';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onEdit: (user: User) => void;
}

export const UserDetailModal = ({
  isOpen,
  onClose,
  user,
  onEdit,
}: UserDetailModalProps) => {
  if (!user) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail User"
      subtitle="Berikut adalah detail dari user yang dipilih."
      maxWidth="lg"
    >
      <div className="p-6">
        <div className="space-y-6">
          {/* User Info Section */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="space-y-5">
              {/* Username & Email */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                    Username
                  </label>
                  <p className="text-base font-semibold text-gray-900 leading-tight">
                    {user.username}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                    Email
                  </label>
                  <p className="text-base font-semibold text-gray-900 leading-tight">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                  Nama Lengkap
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {user.full_name}
                </p>
              </div>

              {/* Role & Status */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Role
                  </label>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                    <span className="text-sm text-blue-700 font-medium capitalize">
                      {user.role?.name || 'N/A'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Status
                  </label>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                    user.is_active
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    {user.is_active ? (
                      <>
                        <Check size={16} className="text-green-600" />
                        <span className="text-sm text-green-700 font-medium">Aktif</span>
                      </>
                    ) : (
                      <>
                        <XIcon size={16} className="text-red-600" />
                        <span className="text-sm text-red-700 font-medium">Nonaktif</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Dibuat Pada
              </label>
              <p className="text-sm text-gray-700">
                {formatDate(user.created_at)}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Terakhir Diupdate
              </label>
              <p className="text-sm text-gray-700">
                {formatDate(user.updated_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Tutup
          </button>
          <button
            onClick={() => onEdit(user)}
            className="px-6 py-2.5 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 font-medium shadow-sm"
          >
            <Pencil size={18} />
            Edit User
          </button>
        </div>
      </div>
    </Modal>
  );
};
