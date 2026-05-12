import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // 监听窗口大小变化，关闭移动菜单
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <div className="text-xl font-bold text-purple-600">🐾 宠物论坛</div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-purple-600 font-medium">
                首页
              </a>
              <a href="/posts" className="text-gray-700 hover:text-purple-600 font-medium">
                帖子
              </a>
              <a href="/search" className="text-gray-700 hover:text-purple-600 font-medium">
                搜索
              </a>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>

                  {/* Desktop Profile Menu */}
                  <div className="hidden md:flex items-center space-x-4">
                    <a
                      href="/posts/create"
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 font-medium transition-colors"
                    >
                      发布帖子
                    </a>

                    <div className="relative group">
                      <div className="flex items-center cursor-pointer">
                        <img
                          src={user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.id}
                          alt={user?.nickname || user?.username}
                          className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                        />
                        <span className="ml-2 text-gray-700 font-medium">{user?.nickname || user?.username}</span>
                        <svg
                          className="w-4 h-4 ml-1 text-gray-400 group-hover:text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                        <a
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          个人中心
                        </a>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          退出登录
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <div className="hidden md:flex space-x-3">
                    <a href="/auth/login" className="text-gray-700 hover:text-purple-600 font-medium">
                      登录
                    </a>
                    <a
                      href="/auth/register"
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 font-medium transition-colors"
                    >
                      注册
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                首页
              </a>
              <a
                href="/posts"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                帖子
              </a>
              <a
                href="/search"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                搜索
              </a>
              {isAuthenticated ? (
                <>
                  <a
                    href="/posts/create"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-purple-600 hover:bg-purple-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    发布帖子
                  </a>
                  <a
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    个人中心
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    退出登录
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/auth/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    登录
                  </a>
                  <a
                    href="/auth/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-purple-600 hover:bg-purple-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    注册
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">宠物论坛</h3>
              <p className="text-gray-600">
                一个专注于宠物分享和交流的社区平台，让爱宠人士聚集在一起，分享美好时光。
              </p>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">快速链接</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-600 hover:text-purple-600">关于我们</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-purple-600">联系我们</a></li>
                <li><a href="/terms" className="text-gray-600 hover:text-purple-600">服务条款</a></li>
                <li><a href="/privacy" className="text-gray-600 hover:text-purple-600">隐私政策</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">关注我们</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-purple-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-purple-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0c-6.627 0-12 5.373-12 12s5.373 12 12 12c6.628 0 12-5.373 12-12s-5.372-12-12-12zm6.983 9h-1.766v2.527h1.766v6.539h-3.613v-6.539h1.861l-.311-2.527h-1.55l.366 2.527h-1.812v-2.527h1.812l.367 2.527h1.548l-.368-2.527zm-6.828 0h1.555v8.109h-1.555v-8.109zm-2.021 0h1.55v8.109h-1.55v-8.109z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-purple-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t pt-6 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} 宠物论坛. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
