import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChangePasswordRequest } from '../types/user.types';
import { useAuth } from '../../../hooks/useAuth';

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { changePassword, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ChangePasswordRequest & { confirmPassword: string }>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setShowSuccess(false);

    if (formData.newPassword !== formData.confirmPassword) {
      clearError();
      return;
    }

    try {
      await changePassword(
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        () => {
          setShowSuccess(true);
          setTimeout(() => {
            onSuccess?.();
            navigate('/profile');
          }, 1000);
        }
      );
    } catch (err) {
      console.error('Failed to change password:', err);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    navigate('/profile');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">修改密码</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {showSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          密码修改成功！
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 旧密码 */}
        <div>
          <label
            htmlFor="oldPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            旧密码
          </label>
          <input
            id="oldPassword"
            name="oldPassword"
            type="password"
            required
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="请输入旧密码"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* 新密码 */}
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            新密码
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="请输入新密码（至少6位）"
            minLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          />
          <p className="mt-1 text-sm text-gray-500">
            密码至少需要6位
          </p>
        </div>

        {/* 确认新密码 */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            确认新密码
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="请再次输入新密码"
            minLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          />
          {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              两次密码输入不一致
            </p>
          )}
        </div>

        {/* 表单操作按钮 */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={
              isLoading ||
              !formData.oldPassword ||
              !formData.newPassword ||
              !formData.confirmPassword ||
              formData.newPassword !== formData.confirmPassword
            }
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '修改中...' : '修改密码'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;