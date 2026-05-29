import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UpdateProfileRequest, Gender } from '../types/user.types';
import { useAuth } from '../../../hooks/useAuth';

interface EditProfileFormProps {
  initialData?: Partial<UpdateProfileRequest>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const { user, updateProfile, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    nickname: initialData?.nickname || '',
    bio: initialData?.bio || '',
    gender: initialData?.gender ?? Gender.UNKNOWN,
    birthday: initialData?.birthday || '',
    city: initialData?.city || '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nickname: initialData?.nickname || user.nickname || user.username,
        bio: initialData?.bio || user.bio || '',
        gender: initialData?.gender ?? user.gender ?? Gender.UNKNOWN,
        birthday: initialData?.birthday || user.birthday?.split('T')[0] || '',
        city: initialData?.city || user.city || '',
      });
    }
  }, [user, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'gender' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setShowSuccess(false);

    const normalizedBirthday = formData.birthday
      ? new Date(`${formData.birthday}T00:00:00`).toISOString()
      : undefined;

    const payload: UpdateProfileRequest = {
      nickname: (formData.nickname || '').trim(),
      bio: formData.bio?.trim() || undefined,
      gender: formData.gender,
      birthday: normalizedBirthday,
      city: formData.city?.trim() || undefined,
    };

    try {
      await updateProfile(payload, () => {
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess?.();
          navigate('/profile');
        }, 1000);
      });
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    navigate('/profile');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">编辑个人资料</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {showSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          个人资料更新成功！
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 昵称 */}
        <div>
          <label
            htmlFor="nickname"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            昵称
          </label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            required
            value={formData.nickname}
            onChange={handleChange}
            placeholder="请输入昵称"
            maxLength={20}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          />
          <p className="mt-1 text-sm text-gray-500">
            昵称最多20个字符
          </p>
        </div>

        {/* 个人简介 */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            个人简介
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="请输入个人简介"
            maxLength={500}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          />
          <p className="mt-1 text-sm text-gray-500">
            简介最多500个字符
          </p>
        </div>

        {/* 性别 */}
        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            性别
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          >
            <option value={Gender.UNKNOWN}>未知</option>
            <option value={Gender.MALE}>男</option>
            <option value={Gender.FEMALE}>女</option>
          </select>
        </div>

        {/* 生日 */}
        <div>
          <label
            htmlFor="birthday"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            生日
          </label>
          <input
            id="birthday"
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* 城市 */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            城市
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            placeholder="请输入所在城市"
            maxLength={50}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          />
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
            disabled={isLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
