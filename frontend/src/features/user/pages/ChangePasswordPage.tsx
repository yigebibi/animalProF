import React from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../components/SideMenu';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { useAuth } from '../../../hooks/useAuth';

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleMenuClick = (item: string) => {
    switch (item) {
      case 'profile':
        navigate('/profile');
        break;
      case 'pets':
        navigate('/profile/pets');
        break;
      case 'posts':
        navigate('/profile/posts');
        break;
      case 'favorites':
        navigate('/profile/favorites');
        break;
      case 'settings':
        navigate('/profile/settings');
        break;
      case 'logout':
        logout();
        navigate('/auth/login');
        break;
      default:
        break;
    }
  };

  const handleSuccess = () => {
    // 成功后已经会在组件内部导航，这里只是为了保持接口一致
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* 侧边栏菜单 */}
        <SideMenu
          activeItem="profile"
          onItemClick={handleMenuClick}
        />

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 页面标题 */}
          <div className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-xl font-semibold text-gray-900">修改密码</h1>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
              {/* 导航面包屑 */}
              <div className="mb-6">
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                      <a href="/profile" className="text-gray-600 hover:text-purple-600">
                        个人中心
                      </a>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-gray-400 mx-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        <span className="text-gray-500">修改密码</span>
                      </div>
                    </li>
                  </ol>
                </nav>
              </div>

              {/* 修改密码表单 */}
              <ChangePasswordForm
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
