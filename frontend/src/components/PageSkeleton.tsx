import React from 'react';

const PageSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500">加载中...</p>
    </div>
  </div>
);

export default PageSkeleton;
