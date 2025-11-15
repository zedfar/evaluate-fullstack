import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { userService } from '@/services/userService';
import { roleService } from '@/services/roleService';
import type { CreateUserData, User } from '@/types/user.types';
import type { Role } from '@/types/role.types';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null; // Optional: for edit mode
}

const initialFormData: CreateUserData = {
  username: '',
  email: '',
  full_name: '',
  password: '',
  role_id: '',
};

export const UserFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  user = null,
}: UserFormModalProps) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState<CreateUserData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!user;

  useEffect(() => {
    if (!isOpen) return;

    const abortController = new AbortController();

    const loadRoles = async () => {
      try {
        const response = await roleService.getAll(undefined, {
          signal: abortController.signal,
        });
        setRoles(response);
      } catch (err: any) {
        if (err.name === 'CanceledError' || err.name === 'AbortError') {
          return;
        }
        console.error('Error fetching roles:', err);
      }
    };

    loadRoles();

    // Populate form data if editing
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        password: '', // Don't pre-fill password
        role_id: user.role_id,
      });
    } else {
      setFormData(initialFormData);
    }

    return () => {
      abortController.abort();
    };
  }, [isOpen, user]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) {
      errors.username = 'Username wajib diisi';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email tidak valid';
    }
    if (!formData.full_name.trim()) {
      errors.full_name = 'Nama lengkap wajib diisi';
    }
    if (!isEditMode && !formData.password) {
      errors.password = 'Password wajib diisi';
    }
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    }
    if (!formData.role_id) {
      errors.role_id = 'Role wajib dipilih';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode && user) {
        // Update existing user
        const updateData: any = {
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name,
          role_id: formData.role_id,
        };
        // Only include password if it's been changed
        if (formData.password) {
          updateData.password = formData.password;
        }
        await userService.update(user.id, updateData);
      } else {
        // Create new user
        await userService.create(formData);
      }

      // Reset form
      setFormData(initialFormData);
      setFormErrors({});

      // Close modal and trigger success
      onClose();
      onSuccess();
    } catch (err: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} user:`, err);
      setFormErrors({ submit: err.message || `Gagal ${isEditMode ? 'mengupdate' : 'menambahkan'} user` });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setFormErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit User" : "Tambah User"}
      subtitle={isEditMode ? "Perbarui data user di bawah ini." : "Masukkan data user baru untuk menambahkannya."}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="p-6">
        {/* Error Message */}
        {formErrors.submit && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 mb-6">
            <AlertCircle size={18} />
            <p className="text-sm font-medium">{formErrors.submit}</p>
          </div>
        )}

        <div className="space-y-5">
          {/* Username & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="johndoe"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                  formErrors.username ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {formErrors.username && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {formErrors.username}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                  formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {formErrors.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {formErrors.email}
                </p>
              )}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-900 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                formErrors.full_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {formErrors.full_name && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle size={12} />
                {formErrors.full_name}
              </p>
            )}
          </div>

          {/* Password & Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password {!isEditMode && <span className="text-red-500">*</span>}
                {isEditMode && <span className="text-xs text-gray-500">(Kosongkan jika tidak diubah)</span>}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isEditMode ? "Isi jika ingin mengubah" : "Minimal 6 karakter"}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                  formErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {formErrors.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {formErrors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="role_id" className="block text-sm font-medium text-gray-900 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role_id"
                name="role_id"
                value={formData.role_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                  formErrors.role_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {formErrors.role_id && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {formErrors.role_id}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {isEditMode ? 'Mengupdate...' : 'Menyimpan...'}
              </>
            ) : (
              isEditMode ? 'Update User' : 'Tambah User'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
