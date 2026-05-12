import React, { useCallback } from 'react';

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  username?: string;
  userId?: number;
  editable?: boolean;
  onUpload?: (file: File) => void;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  avatarUrl,
  size = 'md',
  username,
  userId,
  editable = false,
  onUpload,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  const defaultAvatar =
    userId !== undefined
      ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
      : username
      ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      : 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

  const avatarSrc = avatarUrl || defaultAvatar;

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onUpload) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  return (
    <div className={`relative ${className}`}>
      <img
        src={avatarSrc}
        alt={username || 'User Avatar'}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-sm`}
      />
      {editable && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 rounded-full" />
          <label className="relative cursor-pointer">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;