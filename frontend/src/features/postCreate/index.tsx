import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useCreatePostMutation, useGetPostByIdQuery, useGetPetsQuery, useUpdatePostMutation, useUploadFileMutation } from '../../store/services/api';
import { useAuth } from '../../hooks/useAuth';

const CATEGORIES = [
  { value: 'general', label: '综合' },
  { value: 'share', label: '分享' },
  { value: 'help', label: '求助' },
  { value: 'discussion', label: '讨论' },
];

const COMMON_TAGS = ['可爱', '日常', '求助', '经验', '搞笑', '宠物用品', '健康', '训练', '饮食', '美容'];

const PostCreatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!id;
  const postId = Number(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<number | undefined>(undefined);

  const [createPost, { isLoading: creating }] = useCreatePostMutation();
  const [updatePost, { isLoading: updating }] = useUpdatePostMutation();
  const [uploadFile, { isLoading: uploading }] = useUploadFileMutation();
  const { data: pets } = useGetPetsQuery();
  const { data: post, isLoading: loadingPost } = useGetPostByIdQuery(postId, {
    skip: !isEditMode || !postId,
  });

  useEffect(() => {
    if (!post) {
      return;
    }

    if (user && post.userId !== user.id) {
      navigate(`/posts/${post.id}`);
      return;
    }

    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setTags(post.tags || []);
    setCoverImage(post.coverUrl || null);
    setCoverFile(null);
    setSelectedPetId(post.petId);
  }, [navigate, post, user]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('图片大小不能超过10MB');
        return;
      }
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('请输入帖子标题');
      return;
    }

    if (!content.trim()) {
      alert('请输入帖子内容');
      return;
    }

    try {
      let coverUrl: string | undefined;

      if (coverFile) {
        const formData = new FormData();
        formData.append('file', coverFile);
        const fileResult = await uploadFile(formData).unwrap();
        coverUrl = fileResult.url || fileResult.filePath;
      }

      const payload = {
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tags.length > 0 ? tags : undefined,
        petId: selectedPetId,
        coverUrl,
      };

      const result = isEditMode
        ? await updatePost({ id: postId, ...payload }).unwrap()
        : await createPost(payload).unwrap();

      navigate(`/posts/${result.id}`);
    } catch (err) {
      console.error('Failed to save post:', err);
      alert(isEditMode ? '更新失败，请稍后重试' : '发布失败，请稍后重试');
    }
  };

  const isSubmitting = creating || updating || uploading;

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to="/posts"
          className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-6"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回帖子列表
        </Link>

        <div className="overflow-hidden rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(99,74,137,0.12)] sm:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--ink-soft)]">Create</div>
              <h1 className="mt-2 text-3xl font-black text-[color:var(--ink-deep)]">{isEditMode ? '编辑帖子' : '发布帖子'}</h1>
              <p className="mt-2 text-[color:var(--ink-soft)]">把故事写得更柔软一点，给封面、标签和分类一些可爱的秩序感。</p>
            </div>
            <div className="rounded-[24px] bg-[linear-gradient(135deg,#fff2e5,#fff9f4)] px-4 py-3 text-sm font-semibold text-[color:var(--ink-soft)]">
              今日灵感：晒图、求助、分享、讨论
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                封面图片（可选）
              </label>
              {coverImage ? (
                <div className="relative inline-block">
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="max-h-64 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-[24px] border-2 border-dashed border-[color:var(--line-soft)] bg-[rgba(255,250,244,0.76)] p-8 text-center transition-colors hover:border-rose-300 hover:bg-rose-50"
                >
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600">点击上传封面图片</p>
                  <p className="text-sm text-gray-400 mt-1">支持 JPG、PNG，最大 10MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                标题 <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入帖子标题"
                maxLength={100}
                className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-[rgba(255,250,244,0.76)] px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-300"
                required
              />
              <p className="mt-1 text-sm text-gray-500 text-right">
                {title.length}/100
              </p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                分类
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-[rgba(255,250,244,0.76)] px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-300"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Pet (optional) */}
            {pets && pets.length > 0 && (
              <div>
                <label htmlFor="pet" className="block text-sm font-medium text-gray-700 mb-2">
                  关联宠物（可选）
                </label>
                <select
                  id="pet"
                  value={selectedPetId || ''}
                  onChange={(e) => setSelectedPetId(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-[rgba(255,250,244,0.76)] px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-300"
                  >
                  <option value="">不关联</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签（可选，最多5个）
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-600"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-purple-500 hover:text-purple-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="输入标签后按回车添加"
                disabled={tags.length >= 5}
                 className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-[rgba(255,250,244,0.76)] px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-300 disabled:bg-gray-100"
               />
              <div className="flex flex-wrap gap-2 mt-2">
                {COMMON_TAGS.filter((t) => !tags.includes(t)).slice(0, 5).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    disabled={tags.length >= 5}
                     className="rounded-full border border-[color:var(--line-soft)] bg-white px-3 py-1 text-sm text-[color:var(--ink-deep)] shadow-[0_8px_18px_rgba(99,74,137,0.06)] disabled:opacity-50"
                   >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="分享你的宠物故事..."
                rows={10}
                className="w-full rounded-[24px] border border-[color:var(--line-soft)] bg-[rgba(255,250,244,0.76)] px-4 py-3 resize-none focus:border-transparent focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-4">
              <Link
                to="/posts"
                className="text-sm font-semibold text-[color:var(--ink-soft)] hover:text-[color:var(--ink-deep)]"
              >
                取消
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="rounded-full bg-[color:var(--ink-deep)] px-8 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(78,56,120,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (isEditMode ? '保存中...' : '发布中...') : (isEditMode ? '保存修改' : '发布帖子')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostCreatePage;
