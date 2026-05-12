import React from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../components/SideMenu';

const MyPetsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleMenuClick = (item: string) => {
    switch (item) {
      case 'profile':
        navigate('/profile');
        break;
      case 'pets':
        // 已在我的宠物页面
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
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* 侧边栏菜单 */}
        <SideMenu
          activeItem="pets"
          onItemClick={handleMenuClick}
        />

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 页面标题 */}
          <div className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-xl font-semibold text-gray-900">我的宠物</h1>
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
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">宠物管理功能开发中</h2>
                <p className="text-gray-500 mb-6">
                  宠物管理功能目前正在开发中，请稍后再试。
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

export default MyPetsPage;