import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../components/SideMenu';
import { NotificationSettings, PrivacySettings, AccountSecuritySettings } from '../types/user.types';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
    commentNotifications: true,
    likeNotifications: true,
    followNotifications: true,
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    publicProfile: true,
    allowComments: true,
    allowLikes: true,
    allowFollows: true,
  });

  const [accountSecurity, setAccountSecurity] = useState<AccountSecuritySettings>({
    emailVerified: true,
    phoneVerified: false,
    twoFactorEnabled: false,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleMenuClick = (item: string) => {
    switch (item) {
      case 'profile':
        navigate('/profile');
        break;
      case 'pets':
        navigate('/profile/pets');
        break;
      case 'posts':
        navigate('/profile/posts');
        break;
      case 'favorites':
        navigate('/profile/favorites');
        break;
      case 'settings':
        // 已在设置页面
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: 调用 API 保存设置
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage('设置保存成功！');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    // TODO: 实现账户删除功能
    console.log('Deleting account...');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* 侧边栏菜单 */}
        <SideMenu
          activeItem="settings"
          onItemClick={handleMenuClick}
        />

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 页面标题 */}
          <div className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-xl font-semibold text-gray-900">账户设置</h1>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {/* 成功提示 */}
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  {successMessage}
                </div>
              )}

              {/* 通知设置 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">通知设置</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">推送通知</div>
                      <div className="text-sm text-gray-500">接收应用推送通知</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.pushNotifications}
                        onChange={(e) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            pushNotifications: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">邮件通知</div>
                      <div className="text-sm text-gray-500">接收邮件通知</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            emailNotifications: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">评论通知</div>
                      <div className="text-sm text-gray-500">有人评论时通知</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.commentNotifications}
                        onChange={(e) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            commentNotifications: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">点赞通知</div>
                      <div className="text-sm text-gray-500">有人点赞时通知</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.likeNotifications}
                        onChange={(e) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            likeNotifications: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">关注通知</div>
                      <div className="text-sm text-gray-500">有人关注时通知</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.followNotifications}
                        onChange={(e) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            followNotifications: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* 隐私设置 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">隐私设置</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">公开个人资料</div>
                      <div className="text-sm text-gray-500">允许其他用户查看你的个人资料</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.publicProfile}
                        onChange={(e) =>
                          setPrivacySettings((prev) => ({
                            ...prev,
                            publicProfile: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">允许评论</div>
                      <div className="text-sm text-gray-500">允许其他用户评论你的帖子</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.allowComments}
                        onChange={(e) =>
                          setPrivacySettings((prev) => ({
                            ...prev,
                            allowComments: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">允许点赞</div>
                      <div className="text-sm text-gray-500">允许其他用户点赞你的内容</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.allowLikes}
                        onChange={(e) =>
                          setPrivacySettings((prev) => ({
                            ...prev,
                            allowLikes: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">允许关注</div>
                      <div className="text-sm text-gray-500">允许其他用户关注你</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.allowFollows}
                        onChange={(e) =>
                          setPrivacySettings((prev) => ({
                            ...prev,
                            allowFollows: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* 账户安全 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">账户安全</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">邮箱验证</div>
                      <div className="text-sm text-gray-500">
                        {accountSecurity.emailVerified
                          ? '邮箱已验证'
                          : '邮箱未验证'}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      accountSecurity.emailVerified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {accountSecurity.emailVerified ? '已验证' : '未验证'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">手机验证</div>
                      <div className="text-sm text-gray-500">
                        {accountSecurity.phoneVerified
                          ? '手机已验证'
                          : '手机未验证'}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      accountSecurity.phoneVerified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {accountSecurity.phoneVerified ? '已验证' : '未验证'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">两步验证</div>
                      <div className="text-sm text-gray-500">增强账户安全性</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accountSecurity.twoFactorEnabled}
                        onChange={(e) =>
                          setAccountSecurity((prev) => ({
                            ...prev,
                            twoFactorEnabled: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* 危险区域 */}
              <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-100">
                <h2 className="text-lg font-semibold text-red-900 mb-4">危险操作</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">删除账户</div>
                      <div className="text-sm text-gray-500">
                        永久删除您的账户和所有相关数据
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium transition-colors"
                    >
                      删除账户
                    </button>
                  </div>
                </div>
              </div>

              {/* 保存按钮 */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? '保存中...' : '保存设置'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 删除账户确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">确认删除账户</h3>
            <p className="text-gray-600 mb-6">
              确定要删除您的账户吗？此操作不可撤销，您的所有数据将被永久删除。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;