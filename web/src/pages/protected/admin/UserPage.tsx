import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import type { User } from '@/types/user.types';
import { UserFormModal, UserDetailModal } from '@/components/users';
import { SuccessModal } from '@/components/ui/SuccessModal';
import {
    Search,
    Plus,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Edit,
    RefreshCw,
    Trash2,
    Loader2,
    ArrowUp,
    ArrowDown,
    UserCircle,
} from 'lucide-react';

export default function UserPage() {
    const [dataUsers, setUsers] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);

    // Filter & Sort States
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'username' | 'email' | 'full_name' | 'created_at'>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // UI States
    const [openDropdown, setOpenDropdown] = useState<any>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterLoading, setFilterLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Fetch users with server-side filtering, sorting, and pagination
    const fetchUsers = async (signal?: AbortSignal) => {
        if (isInitialLoad) {
            setLoading(true);
        } else {
            setFilterLoading(true);
        }

        try {
            const params = {
                search: searchQuery || undefined,
                sort_by: sortBy,
                order: sortOrder,
                skip: (currentPage - 1) * itemsPerPage,
                limit: itemsPerPage,
            };

            const response = await userService.getAll(params, { signal });
            console.log('Users fetched:', response);

            setUsers(response.data);
            setTotalUsers(response.metadata.total);

            if (isInitialLoad) {
                setIsInitialLoad(false);
            }
        } catch (err: any) {
            if (err.name === 'CanceledError' || err.name === 'AbortError') {
                console.log('Request was cancelled');
                return;
            }
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
            setFilterLoading(false);
        }
    };

    const handleUserAdded = () => {
        setShowSuccessModal(true);
        fetchUsers();
    };

    const handleViewDetail = (user: User) => {
        setSelectedUser(user);
        setShowDetailModal(true);
        setOpenDropdown(null);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setShowDetailModal(false);
        setShowEditModal(true);
        setOpenDropdown(null);
    };

    const handleUserUpdated = () => {
        setShowSuccessModal(true);
        fetchUsers();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            try {
                await userService.delete(id);
                await fetchUsers();
                setOpenDropdown(null);
            } catch (err) {
                console.error('Error deleting user:', err);
            }
        }
    };

    const handleToggleActive = async (user: User) => {
        try {
            await userService.toggleActive(user.id, !user.is_active);
            await fetchUsers();
            setOpenDropdown(null);
        } catch (err) {
            console.error('Error toggling user status:', err);
        }
    };

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
            setCurrentPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    // Initial data load
    useEffect(() => {
        const abortController = new AbortController();
        fetchUsers(abortController.signal);

        return () => {
            abortController.abort();
        };
    }, []);

    // Refetch when filters, sort, or pagination changes
    useEffect(() => {
        const abortController = new AbortController();

        if (!isInitialLoad) {
            fetchUsers(abortController.signal);
        }

        return () => {
            abortController.abort();
        };
    }, [searchQuery, sortBy, sortOrder, currentPage, itemsPerPage]);

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / itemsPerPage) || 1;

    // Reset filters
    const handleResetFilters = () => {
        setSearchInput('');
        setSearchQuery('');
        setSortBy('created_at');
        setSortOrder('desc');
        setCurrentPage(1);
    };

    // Toggle sort order
    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            {/* Title and Actions */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Daftar User</h1>
                        <p className="text-sm text-gray-600 mt-1">Kelola semua user yang terdaftar di sistem.</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => fetchUsers()}
                            disabled={filterLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <RefreshCw size={18} className={filterLoading ? 'animate-spin' : ''} />
                            Perbarui Data
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Tambah User
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                <div className="flex flex-col lg:flex-row gap-3">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari user (username, email, nama)..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        />
                        {searchInput && searchInput !== searchQuery && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 size={16} className="animate-spin text-gray-400" />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {/* Sort By Dropdown */}
                        <div className="flex gap-1">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 transition-colors"
                            >
                                <option value="created_at">Terbaru</option>
                                <option value="username">Username</option>
                                <option value="email">Email</option>
                                <option value="full_name">Nama</option>
                            </select>

                            {/* Sort Order Button */}
                            <button
                                onClick={toggleSortOrder}
                                className="px-3 py-2 text-gray-700 bg-white border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-50 transition-colors"
                                title={sortOrder === 'asc' ? 'Urutan: Naik (A-Z)' : 'Urutan: Turun (Z-A)'}
                            >
                                {sortOrder === 'asc' ? (
                                    <ArrowUp size={18} className="text-green-600" />
                                ) : (
                                    <ArrowDown size={18} className="text-orange-600" />
                                )}
                            </button>
                        </div>

                        {/* Reset Filters Button */}
                        {(searchQuery || sortBy !== 'created_at' || sortOrder !== 'desc') && (
                            <button
                                onClick={handleResetFilters}
                                className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                </div>

                {/* Active Filters Display */}
                {searchQuery && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                            Search: "{searchQuery}"
                            <button
                                onClick={() => {
                                    setSearchInput('');
                                    setSearchQuery('');
                                }}
                                className="hover:text-blue-900"
                            >
                                �
                            </button>
                        </span>
                    </div>
                )}
            </div>

            {/* Table - Desktop */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {dataUsers.length > 0 ? (
                                dataUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                                    <UserCircle className="text-orange-600" size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.username}</p>
                                                    <p className="text-sm text-gray-500">{user.full_name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                                                {user.role?.name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${user.is_active
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                {user.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleViewDetail(user)}
                                                className="text-orange-500 hover:text-orange-600 font-medium text-sm mr-3 transition-colors"
                                            >
                                                Lihat Detail
                                            </button>
                                            <div className="relative inline-block">
                                                <button
                                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                                    onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                                                >
                                                    <MoreVertical size={20} />
                                                </button>
                                                {openDropdown === user.id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-10"
                                                            onClick={() => setOpenDropdown(null)}
                                                        />
                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20">
                                                            <button
                                                                onClick={() => handleEditUser(user)}
                                                                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 rounded-t-lg transition-colors"
                                                            >
                                                                <Edit size={18} />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleToggleActive(user)}
                                                                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-t transition-colors"
                                                            >
                                                                <RefreshCw size={18} />
                                                                {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(user.id)}
                                                                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 border-t rounded-b-lg transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="text-gray-500">
                                            <p className="text-lg font-medium mb-1">Tidak ada user ditemukan</p>
                                            <p className="text-sm">Coba ubah filter pencarian Anda</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Cards - Mobile/Tablet */}
            <div className="lg:hidden space-y-3">
                {dataUsers.length > 0 ? (
                    dataUsers.map((user) => (
                        <div key={user.id} className="bg-white rounded-lg shadow-sm border p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <UserCircle className="text-orange-600" size={28} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 mb-1">{user.username}</h3>
                                    <p className="text-sm text-gray-600 mb-1">{user.full_name}</p>
                                    <p className="text-sm text-gray-500 mb-2 truncate">{user.email}</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                                            {user.role?.name || 'N/A'}
                                        </span>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${user.is_active
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {user.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors"
                                        onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                    {openDropdown === user.id && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setOpenDropdown(null)}
                                            />
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20">
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 rounded-t-lg transition-colors"
                                                >
                                                    <Edit size={18} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(user)}
                                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-t transition-colors"
                                                >
                                                    <RefreshCw size={18} />
                                                    {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 border-t rounded-b-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                    Hapus
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => handleViewDetail(user)}
                                className="w-full mt-3 text-orange-500 hover:text-orange-600 font-medium text-sm text-center transition-colors"
                            >
                                Lihat Detail
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                        <p className="text-lg font-medium text-gray-500 mb-1">Tidak ada user ditemukan</p>
                        <p className="text-sm text-gray-400">Coba ubah filter pencarian Anda</p>
                    </div>
                )}
            </div>

            {/* Loading Overlay for Filters */}
            {filterLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-40">
                    <div className="bg-white rounded-lg p-4 shadow-lg flex items-center gap-3">
                        <Loader2 size={24} className="animate-spin text-orange-500" />
                        <span className="text-gray-700 font-medium">Memuat data...</span>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {dataUsers.length > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Menampilkan</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            disabled={filterLoading}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all disabled:opacity-50"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="text-gray-600">
                            per halaman (Total: {totalUsers} user)
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1 || filterLoading}
                            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    disabled={filterLoading}
                                    className={`w-10 h-10 rounded-lg font-medium transition-colors disabled:opacity-50 ${currentPage === pageNum
                                        ? 'bg-orange-500 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        {totalPages > 5 && (
                            <>
                                <span className="px-2 text-gray-400">...</span>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={filterLoading}
                                    className="w-10 h-10 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || filterLoading}
                            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            <UserFormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={handleUserAdded}
            />

            {/* Edit User Modal */}
            <UserFormModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSuccess={handleUserUpdated}
                user={selectedUser}
            />

            {/* User Detail Modal */}
            <UserDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                user={selectedUser}
                onEdit={handleEditUser}
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Berhasil!"
                message="Operasi berhasil dilakukan."
            />
        </main>
    );
};
