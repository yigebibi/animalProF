import React from 'react';
import Skeleton from './index';

const PostListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Skeleton height="2.5rem" width="10rem" className="mb-6" />
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton height="2.5rem" className="flex-1" />
            <Skeleton height="2.5rem" width="8rem" />
            <Skeleton height="2.5rem" width="8rem" />
            <Skeleton height="2.5rem" width="6rem" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
            <Skeleton variant="rectangular" height="180px" className="aspect-video" />
            <div className="p-5">
              <Skeleton height="1.5rem" className="mb-3" width="80%" />
              <Skeleton height="1rem" className="mb-2" />
              <Skeleton height="1rem" className="mb-4" width="60%" />
              <div className="flex gap-2 mb-4">
                <Skeleton variant="rounded" height="1.5rem" width="3rem" />
                <Skeleton variant="rounded" height="1.5rem" width="3rem" />
                <Skeleton variant="rounded" height="1.5rem" width="3rem" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Skeleton variant="circular" width="1.5rem" height="1.5rem" />
                  <Skeleton width="4rem" height="0.875rem" />
                </div>
                <div className="flex gap-3">
                  <Skeleton width="2rem" height="1rem" />
                  <Skeleton width="2rem" height="1rem" />
                  <Skeleton width="2rem" height="1rem" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostListSkeleton;
