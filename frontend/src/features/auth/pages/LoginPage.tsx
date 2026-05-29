import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

interface LocationState {
  from?: { pathname?: string };
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as LocationState)?.from?.pathname || '/';

  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      try {
        const { email } = JSON.parse(rememberedUser);
        setEmail(email);
        setRememberMe(true);
      } catch (parseError) {
        console.error('解析记住的用户信息失败:', parseError);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(
        { email, password },
        rememberMe,
        () => {
          navigate(from, { replace: true });
        },
        (err) => {
          console.error('Login failed:', err);
        },
      );
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-transparent px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(145deg,rgba(255,235,220,0.95),rgba(255,255,255,0.84),rgba(221,244,255,0.92))] p-8 shadow-[0_28px_70px_rgba(99,74,137,0.14)] lg:p-12">
          <div className="absolute -right-8 top-8 text-7xl opacity-20">🐾</div>
          <div className="inline-flex rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] shadow-[0_10px_25px_rgba(99,74,137,0.08)]">欢迎回家</div>
          <h1 className="mt-6 text-4xl font-black leading-tight text-[color:var(--ink-deep)] lg:text-5xl">
            和毛孩子的故事，
            <span className="block text-rose-500">从这里继续。</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[color:var(--ink-soft)]">
            登录后继续查看收藏、发布日记、管理宠物资料，也可以回到社区看看今天谁家的小可爱又火了。
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/80 bg-white/70 p-4">
              <div className="text-2xl">🍼</div>
              <div className="mt-2 font-bold text-[color:var(--ink-deep)]">继续记录</div>
              <div className="mt-1 text-sm text-[color:var(--ink-soft)]">把日常、成长和高光都留下来。</div>
            </div>
            <div className="rounded-[24px] border border-white/80 bg-white/70 p-4">
              <div className="text-2xl">💞</div>
              <div className="mt-2 font-bold text-[color:var(--ink-deep)]">看看互动</div>
              <div className="mt-1 text-sm text-[color:var(--ink-soft)]">点赞、评论和收藏都在等你。</div>
            </div>
            <div className="rounded-[24px] border border-white/80 bg-white/70 p-4">
              <div className="text-2xl">🌈</div>
              <div className="mt-2 font-bold text-[color:var(--ink-deep)]">轻松逛社区</div>
              <div className="mt-1 text-sm text-[color:var(--ink-soft)]">更柔和的页面，更舒服的阅读体验。</div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[32px] border border-white/80 bg-white/92 p-8 shadow-[0_28px_70px_rgba(99,74,137,0.14)] backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-200 via-rose-200 to-sky-200 text-3xl shadow-[0_12px_30px_rgba(99,74,137,0.12)]">🐾</div>
            <h1 className="text-3xl font-black text-[color:var(--ink-deep)]">欢迎回来</h1>
            <p className="mt-2 text-[color:var(--ink-soft)]">登录您的宠物论坛账号</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[color:var(--ink-deep)]">邮箱地址</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-[rgba(255,250,244,0.76)] px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-300"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[color:var(--ink-deep)]">密码</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-[rgba(255,250,244,0.76)] px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-300"
                placeholder="至少6位密码"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-[color:var(--ink-soft)]">记住我</label>
              </div>
              <Link to="/auth/forgot-password" className="text-sm font-semibold text-rose-500 hover:text-rose-600">忘记密码？</Link>
            </div>

            {error && <div className="rounded-[20px] border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-full bg-[color:var(--ink-deep)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(78,56,120,0.22)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="-ml-1 mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  登录中...
                </span>
              ) : (
                '登录'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[color:var(--ink-soft)]">
              还没有账号？
              <Link to="/auth/register" className="ml-2 font-semibold text-rose-500 hover:text-rose-600">立即注册</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
