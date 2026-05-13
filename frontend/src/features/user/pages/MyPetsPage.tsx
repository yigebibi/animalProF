import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetPetsQuery,
  useAddPetMutation,
  useUpdatePetMutation,
  useDeletePetMutation,
} from '../../../store/services/api';
import { Pet } from '../../../types/common';
import SideMenu from '../components/SideMenu';
import { useAuth } from '../../../hooks/useAuth';

const PET_TYPES = ['狗', '猫', '鸟', '鱼', '兔子', '仓鼠', '乌龟', '其他'];
const GENDER_OPTIONS = [
  { value: 0, label: '未知' },
  { value: 1, label: '公' },
  { value: 2, label: '母' },
];

const MyPetsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState('狗');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState(0);
  const [birthday, setBirthday] = useState('');
  const [bio, setBio] = useState('');

  const { data: pets, isLoading } = useGetPetsQuery();
  const [addPet, { isLoading: adding }] = useAddPetMutation();
  const [updatePet, { isLoading: updating }] = useUpdatePetMutation();
  const [deletePet, { isLoading: deleting }] = useDeletePetMutation();

  const resetForm = () => {
    setName('');
    setType('狗');
    setBreed('');
    setGender(0);
    setBirthday('');
    setBio('');
    setEditingPet(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (pet: Pet) => {
    setEditingPet(pet);
    setName(pet.name);
    setType(pet.type);
    setBreed(pet.breed || '');
    setGender(pet.gender);
    setBirthday(pet.birthday ? pet.birthday.split('T')[0] : '');
    setBio(pet.bio || '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const petData = {
        name: name.trim(),
        type,
        breed: breed.trim() || undefined,
        gender,
        birthday: birthday || undefined,
        bio: bio.trim() || undefined,
      };

      if (editingPet) {
        await updatePet({ id: editingPet.id, ...petData }).unwrap();
      } else {
        await addPet(petData as any).unwrap();
      }
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save pet:', err);
      alert('保存失败，请稍后重试');
    }
  };

  const handleDelete = async (petId: number) => {
    try {
      await deletePet(petId).unwrap();
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete pet:', err);
      alert('删除失败，请稍后重试');
    }
  };

  const handleMenuClick = (item: string) => {
    switch (item) {
      case 'profile':
        navigate('/profile');
        break;
      case 'pets':
        break;
      case 'posts':
        navigate('/profile/posts');
        break;
      case 'favorites':
        navigate('/profile/favorites');
        break;
      case 'settings':
        navigate('/profile/settings');
        break;
      default:
        break;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  const calculateAge = (birthday?: string) => {
    if (!birthday) return '-';
    const birth = new Date(birthday);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    if (years > 0) return `${years}岁`;
    if (months > 0) return `${months}月`;
    return '不满1月';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <SideMenu activeItem="pets" onItemClick={handleMenuClick} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900">我的宠物</h1>
              <button
                onClick={handleOpenAdd}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium"
              >
                添加宠物
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
                </div>
              ) : !pets || pets.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">还没有宠物</h2>
                  <p className="text-gray-500 mb-6">添加你的第一只宠物吧！</p>
                  <button
                    onClick={handleOpenAdd}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium"
                  >
                    添加宠物
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pets.map((pet) => (
                    <div key={pet.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
                      <img
                        src={pet.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pet.name}`}
                        alt={pet.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                            <p className="text-sm text-gray-500">
                              {pet.type} {pet.breed && `- ${pet.breed}`}
                            </p>
                          </div>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            pet.gender === 1 ? 'bg-blue-100 text-blue-700' :
                            pet.gender === 2 ? 'bg-pink-100 text-pink-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {pet.gender === 1 ? '♂ 公' : pet.gender === 2 ? '♀ 母' : '未知'}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600 space-y-1">
                          {pet.birthday && <p>生日: {formatDate(pet.birthday)} ({calculateAge(pet.birthday)})</p>}
                          {pet.bio && <p className="line-clamp-2">{pet.bio}</p>}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleOpenEdit(pet)}
                            className="text-sm text-purple-600 hover:text-purple-700"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(pet.id)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            删除
                          </button>
                        </div>
                      </div>

                      {/* Delete Confirm */}
                      {showDeleteConfirm === pet.id && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                            <h3 className="font-semibold text-gray-900 mb-2">确认删除</h3>
                            <p className="text-gray-600 mb-4">确定要删除 {pet.name} 吗？此操作不可撤销。</p>
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                              >
                                取消
                              </button>
                              <button
                                onClick={() => handleDelete(pet.id)}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                              >
                                {deleting ? '删除中...' : '删除'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingPet ? '编辑宠物' : '添加宠物'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  名字 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="宠物名字"
                  required
                  maxLength={20}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  类型 <span className="text-red-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {PET_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  品种
                </label>
                <input
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="如：金毛、波斯猫"
                  maxLength={30}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  性别
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  生日
                </label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  简介
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="介绍一下你的宠物..."
                  maxLength={200}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={adding || updating || !name.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {adding || updating ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPetsPage;
