import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { mockSSE } from '@/hooks/useSSE';
import { ChevronDown, User, Package, Users, Settings, LogOut, X } from 'lucide-react';

export const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const notification = mockSSE();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Determine if current page should use hero header style
  const isHeroPage = location.pathname === '/home' || location.pathname.startsWith('/products');

  // Check if user is admin
  const isAdmin = user?.role?.name === 'admin';

  // Role-based menu items
  const menuItems = isAdmin
    ? [
      { icon: Package, label: 'Products', onClick: () => navigate("/admin/dashboard") },
      { icon: Users, label: 'Users', onClick: () => navigate("/admin/users") },
      { icon: Settings, label: 'Setting', onClick: () => console.log('Setting') },
      { icon: LogOut, label: 'Logout', onClick: handleLogout, isDanger: true },
    ]
    : [
      { icon: LogOut, label: 'Logout', onClick: handleLogout, isDanger: true },
    ];

  // useEffect(() => {
  //   if (notification) {
  //     setShowNotification(true);
  //     setNotificationCount((prev) => prev + 1);
  //   }
  // }, [notification]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const handleNotificationClick = () => {
    setNotificationCount(0);
  };

  console.log(user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Hero Style for User Pages */}
      {isHeroPage ? (
        <header className="absolute top-0 left-0 right-0 bg-black bg-opacity-12 z-30">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 h-[60px] flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/home')}>
              <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                LOGO
              </span>
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>

            {/* User Profile */}
            <div className="relative flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
              >
                <ChevronDown
                  size={16}
                  className={`text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
                <span className="text-xs md:text-sm font-medium text-white hidden sm:block">
                  {user?.username || 'User'}
                </span>
                <div className="w-7 h-7 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.onClick();
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                          item.isDanger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
      ) : (
        /* Header - Normal Style for Admin Pages */
        <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-1 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
                  <span className="text-3xl font-bold tracking-tight">LOGO</span>
                  <div className="flex flex-col">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Admin Section */}
              <div className="relative flex items-center space-x-3">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                  <span className="text-gray-900 font-medium">{user?.username}</span>
                </button>

                {/* Avatar */}
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
                  <User className="w-6 h-6 text-gray-600" />
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-14 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      {menuItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            item.onClick();
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                            item.isDanger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={isHeroPage ? 'min-h-screen' : 'min-h-[calc(100vh-4rem)]'}>
        <Outlet />
      </main>

      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-green-500/95 backdrop-blur-sm text-white rounded-2xl shadow-xl shadow-black/20 max-w-sm overflow-hidden border border-green-400/40">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-green-600/60 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base">New Product Added</span>
              </div>

              <button
                onClick={() => setShowNotification(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 bg-green-50 text-green-900">
              {notification && (
                <>
                  <strong className="block text-lg font-semibold">
                    {notification.data.name}
                  </strong>
                  <p className="mt-1 text-sm font-medium">
                    Price: Rp {notification.data.price.toLocaleString('id-ID')}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Auto-hide notification after 5 seconds */}
      {showNotification && (
        <div className="hidden">
          {setTimeout(() => setShowNotification(false), 5000)}
        </div>
      )}
    </div>
  );
};