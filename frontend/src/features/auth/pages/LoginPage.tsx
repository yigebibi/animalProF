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

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
              <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-[color:var(--ink-soft)]">或者使用</span></div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="inline-flex w-full justify-center rounded-2xl border border-[color:var(--line-soft)] bg-[rgba(255,250,244,0.76)] px-4 py-3 text-sm font-semibold text-[color:var(--ink-deep)] shadow-[0_12px_30px_rgba(99,74,137,0.08)]">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                  <path fill="#34A853" d="M16.0407269,18.012588 C14.957904,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.012588 Z"/>
                  <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.9036631 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.012588 L19.834192,20.9995801 Z"/>
                  <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03467477,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7273816 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                </svg>
                Google
              </button>
              <button className="inline-flex w-full justify-center rounded-2xl border border-[color:var(--line-soft)] bg-[rgba(255,250,244,0.76)] px-4 py-3 text-sm font-semibold text-[color:var(--ink-deep)] shadow-[0_12px_30px_rgba(99,74,137,0.08)]">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#07C160" d="M12,0 C5.372583,0 0,5.372583 0,12 C0,18.627417 5.372583,24 12,24 C18.627417,24 24,18.627417 24,12 C24,5.372583 18.627417,0 12,0 Z"/>
                  <path fill="white" d="M8.6909684,7.86858452 C9.19274137,7.16281273 10.0437703,6.54545455 11.0909091,6.54545455 C12.2057285,6.54545455 13.1387121,7.20370518 13.6106716,8.14085571 L13.6221407,8.16416667 L13.6106716,8.14085571 C13.8419756,8.60940515 13.9890103,9.13217682 14,9.6875 C14,9.86649478 13.9833718,10.0418269 13.9512426,10.2125 L13.9344173,10.296875 L13.9512426,10.2125 C13.9137372,10.4227881 13.8607952,10.628291 13.7937328,10.8265625 C13.7266703,11.024834 13.6458697,11.2156112 13.553121,11.396875 L13.5064623,11.4875 L13.553121,11.396875 C13.1562607,12.1676441 12.4900867,12.7947095 11.6708008,13.1574219 L11.5430762,13.2131516 C10.4860129,13.6680894 9.54719788,13.9090909 8.6909684,13.9090909 C7.64259197,13.9090909 6.79090909,13.2603219 6.28820801,12.5409009 L6.27272727,12.5284091 L6.28820801,12.5409009 C6.01448647,12.1427102 5.87785972,11.6800626 5.87785972,11.1792614 C5.87785972,10.2417964 6.25602438,9.39108201 6.85995478,8.72570641 L6.91942607,8.65795455 L6.85995478,8.72570641 C7.46187205,8.03875085 8.05846327,7.6269126 8.6909684,7.86858452 Z"/>
                </svg>
                微信
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
