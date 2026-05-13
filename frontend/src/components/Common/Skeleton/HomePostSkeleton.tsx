import React from 'react';
import Skeleton from './index';

const HomePostSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <Skeleton variant="rectangular" height="180px" className="aspect-video" />
    <div className="p-5">
      <Skeleton height="1.5rem" className="mb-3" width="85%" />
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
          <Skeleton width="2rem" height="0.875rem" />
          <Skeleton width="2rem" height="0.875rem" />
          <Skeleton width="2rem" height="0.875rem" />
        </div>
      </div>
    </div>
  </div>
);

export const HomePostsSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <HomePostSkeleton key={i} />
    ))}
  </div>
);

export default HomePostSkeleton;
