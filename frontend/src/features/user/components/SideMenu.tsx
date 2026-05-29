import React from 'react';
import { Link } from 'react-router-dom';

interface SideMenuProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ activeItem, onItemClick }) => {
  const menuItems = [
    {
      key: 'profile',
      label: '个人资料',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      path: '/profile',
    },
    {
      key: 'pets',
      label: '我的宠物',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
      path: '/profile/pets',
    },
    {
      key: 'posts',
      label: '我的帖子',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      path: '/profile/posts',
    },
    {
      key: 'favorites',
      label: '我的收藏',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      path: '/profile/favorites',
    },
    {
      key: 'settings',
      label: '账户设置',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      path: '/profile/settings',
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col justify-between border-r border-white/70 bg-[rgba(255,255,255,0.72)] backdrop-blur-xl">
      <div className="p-6">
        <div className="mb-6 rounded-[24px] bg-[linear-gradient(135deg,#fff2e5,#ffffff,#e8f5ff)] p-4 shadow-[0_14px_30px_rgba(99,74,137,0.10)]">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--ink-soft)]">Profile Hub</div>
          <h2 className="mt-2 text-xl font-black text-[color:var(--ink-deep)]">个人中心</h2>
          <p className="mt-1 text-sm text-[color:var(--ink-soft)]">把资料、宠物、帖子和收藏整理得软乎又清楚。</p>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              onClick={() => onItemClick?.(item.key)}
              className={
                `flex items-center rounded-[20px] px-4 py-3 text-sm font-medium transition-all ${
                  activeItem === item.key
                    ? 'border border-rose-200 bg-rose-50 text-rose-600 shadow-[0_12px_25px_rgba(99,74,137,0.08)]'
                    : 'text-[color:var(--ink-soft)] hover:bg-white hover:text-[color:var(--ink-deep)]'
                }`
              }
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-6 pt-0">
        <button
          onClick={() => onItemClick?.('logout')}
          className="flex w-full items-center justify-center rounded-full bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          退出登录
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
