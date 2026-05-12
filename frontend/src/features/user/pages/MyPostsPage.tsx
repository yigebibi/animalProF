import React from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../components/SideMenu';

const MyPostsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleMenuClick = (item: string) => {
    switch (item) {
      case 'profile':
        navigate('/profile');
        break;
      case 'pets':
        navigate('/profile/pets');
        break;
      case 'posts':
        // 已在我的帖子页面
        break;
      case 'favorites':
        navigate('/profile/favorites');
        break;
      case 'settings':
        navigate('/profile/settings');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* 侧边栏菜单 */}
        <SideMenu
          activeItem="posts"
          onItemClick={handleMenuClick}
        />

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 页面标题 */}
          <div className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-xl font-semibold text-gray-900">我的帖子</h1>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
              {/* 页面内容 */}
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">帖子管理功能开发中</h2>
                <p className="text-gray-500 mb-6">
                  帖子管理功能目前正在开发中，请稍后再试。
                </p>
                <button
                  onClick={() => navigate('/profile')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium transition-colors"
                >
                  返回个人中心
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPostsPage;