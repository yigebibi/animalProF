import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const calculatePasswordStrength = (value: string): number => {
    let strength = 0;
    if (value.length >= 6) strength += 25;
    if (value.length >= 10) strength += 25;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength += 25;
    if (/[0-9]/.test(value)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError(null);

    if (password !== confirmPassword) {
      setFormError('密码不一致');
      return;
    }

    if (!agreeTerms) {
      setFormError('请同意服务条款和隐私政策');
      return;
    }

    if (username.length < 3) {
      setFormError('用户名至少需要3个字符');
      return;
    }

    try {
      await register(
        { username, email, password },
        () => {
          navigate('/', { replace: true });
        },
        (err) => {
          setFormError(err.error || err.message || '注册失败');
        },
      );
    } catch (err: any) {
      setFormError(err.error || err.message || '网络错误');
    }
  };

  const getPasswordStrengthText = (strength: number): string => {
    if (strength < 30) return '弱';
    if (strength < 60) return '中';
    if (strength < 90) return '强';
    return '非常强';
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 60) return 'bg-yellow-500';
    if (strength < 90) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-transparent px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="order-2 mx-auto w-full max-w-md rounded-[32px] border border-white/80 bg-white/92 p-8 shadow-[0_28px_70px_rgba(99,74,137,0.14)] backdrop-blur-xl lg:order-1">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-200 via-rose-200 to-sky-200 text-3xl shadow-[0_12px_30px_rgba(99,74,137,0.12)]">🐾</div>
            <h1 className="text-3xl font-black text-[color:var(--ink-deep)]">创建新账号</h1>
            <p className="mt-2 text-[color:var(--ink-soft)]">加入宠物论坛，分享美好时光</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-semibold text-[color:var(--ink-deep)]">用户名</label>
              <input id="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-[rgba(255,250,244,0.76)] px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-300" placeholder="3-20个字符" maxLength={20} minLength={3} />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[color:var(--ink-deep)]">邮箱地址</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-[rgba(255,250,244,0.76)] px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-300" placeholder="your@email.com" />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[color:var(--ink-deep)]">密码</label>
              <input id="password" type="password" required value={password} onChange={(e) => handlePasswordChange(e.target.value)} className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-[rgba(255,250,244,0.76)] px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-300" placeholder="至少6位密码" minLength={6} />
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-[color:var(--ink-soft)]">密码强度: <span className={passwordStrength < 60 ? 'text-rose-500' : 'text-emerald-500'}>{getPasswordStrengthText(passwordStrength)}</span></span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`} style={{ width: `${passwordStrength}%` }}></div>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-[color:var(--ink-deep)]">确认密码</label>
              <input id="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-[rgba(255,250,244,0.76)] px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-300" placeholder="再次输入密码" minLength={6} />
              {password && confirmPassword && password !== confirmPassword && <p className="mt-1 text-sm text-rose-600">密码不一致</p>}
            </div>
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input id="terms" type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-[color:var(--ink-soft)]">
                  我同意
                  <Link to="/terms" className="ml-1 text-rose-500 hover:text-rose-600">服务条款</Link>
                  和
                  <Link to="/privacy" className="ml-1 text-rose-500 hover:text-rose-600">隐私政策</Link>
                </label>
              </div>
            </div>
            {(error || formError) && <div className="rounded-[20px] border border-rose-200 bg-rose-50 p-4 text-rose-700">{formError || error}</div>}
            <button type="submit" disabled={isLoading || !agreeTerms} className="flex w-full justify-center rounded-full bg-[color:var(--ink-deep)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(78,56,120,0.22)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="-ml-1 mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  注册中...
                </span>
              ) : '立即注册'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[color:var(--ink-soft)]">已有账号？<Link to="/auth/login" className="ml-2 font-semibold text-rose-500 hover:text-rose-600">去登录</Link></p>
          </div>
        </div>

        <div className="order-1 overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(145deg,rgba(225,242,255,0.95),rgba(255,255,255,0.84),rgba(255,233,220,0.92))] p-8 shadow-[0_28px_70px_rgba(99,74,137,0.14)] lg:order-2 lg:p-12">
          <div className="inline-flex rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] shadow-[0_10px_25px_rgba(99,74,137,0.08)]">新的小爪印即将加入</div>
          <h2 className="mt-6 text-4xl font-black leading-tight text-[color:var(--ink-deep)] lg:text-5xl">
            把宠物日常、
            <span className="block text-sky-500">漂亮瞬间和求助心声都安放进来。</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[color:var(--ink-soft)]">
            注册之后就能创建自己的宠物资料卡、记录帖子、收藏经验，也能在柔和舒服的页面里慢慢逛社区。
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/80 bg-white/70 p-5">
              <div className="text-3xl">📔</div>
              <h3 className="mt-3 text-lg font-bold text-[color:var(--ink-deep)]">记录专属日记</h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">发帖、晒图、整理成长记录，把每一段陪伴都保存下来。</p>
            </div>
            <div className="rounded-[24px] border border-white/80 bg-white/70 p-5">
              <div className="text-3xl">🧁</div>
              <h3 className="mt-3 text-lg font-bold text-[color:var(--ink-deep)]">加入友好社区</h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">一起交流用品、健康、训练和有趣日常，社区氛围轻松可爱。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
