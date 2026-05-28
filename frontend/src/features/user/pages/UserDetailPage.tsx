import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetUserByIdQuery } from '../../../store/services/api';

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const { data: user, isLoading, isError } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">用户不存在</h1>
            <Link to="/search" className="text-purple-600 hover:text-purple-700 font-medium">返回搜索</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <img
              src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
              alt={user.nickname || user.username}
              className="w-28 h-28 rounded-full object-cover border-4 border-purple-100"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{user.nickname || user.username}</h1>
              <p className="text-gray-500 mt-1">@{user.username}</p>
              {user.bio && <p className="text-gray-700 mt-4 leading-7">{user.bio}</p>}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>性别: {user.gender === 1 ? '男' : user.gender === 2 ? '女' : '未知'}</div>
                <div>城市: {user.city || '未填写'}</div>
                <div>注册时间: {new Date(user.createdAt).toLocaleDateString('zh-CN')}</div>
                <div>生日: {user.birthday ? new Date(user.birthday).toLocaleDateString('zh-CN') : '未填写'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
