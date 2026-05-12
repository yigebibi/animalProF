import React from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../components/SideMenu';

const MyFavoritesPage: React.FC = () => {
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
        navigate('/profile/posts');
        break;
      case 'favorites':
        // 已在我的收藏页面
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
          activeItem="favorites"
          onItemClick={handleMenuClick}
        />

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 页面标题 */}
          <div className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-xl font-semibold text-gray-900">我的收藏</h1>
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">收藏功能开发中</h2>
                <p className="text-gray-500 mb-6">
                  收藏功能目前正在开发中，请稍后再试。
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

export default MyFavoritesPage;