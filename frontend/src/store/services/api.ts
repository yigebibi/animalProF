import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import {
  LoginRequest,
  LoginResponseData,
  RegisterRequest,
  RegisterResponseData,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserSettingsResponse,
  UpdateUserSettingsRequest,
  UserStatsResponse,
  UserActivityResponse,
  CreatePetRequest,
  UpdatePetRequest,
  GetPostsParams,
  CreatePostRequest,
  UpdatePostRequest,
  GetCommentsParams,
  CreateCommentRequest,
  UpdateCommentRequest,
  SearchRequest,
  SearchResponse,
  MarkAsReadRequest,
  ApiResponse,
  PaginatedData,
} from '../../types/api';
import { User, Pet, Post, Comment, Tag, Notification, PaginationResponse, FileInfo } from '../../types/common';

const unwrapResponse = <T>(response: any, fallbackMessage: string): T => {
  if (response && response.code === 200) {
    return response.data;
  }

  throw new Error(response?.message || fallbackMessage);
};

const unwrapPaginationResponse = <T>(response: any, fallbackMessage: string): PaginationResponse<T> => {
  const payload = unwrapResponse<{ data: T[]; meta: { total: number; page: number; limit: number } }>(
    response,
    fallbackMessage,
  );

  return {
    items: payload.data || [],
    total: payload.meta?.total || 0,
    page: payload.meta?.page || 1,
    limit: payload.meta?.limit || 0,
  };
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Post', 'Comment', 'User', 'Pet', 'Notification', 'Tag'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<LoginResponseData, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: any) => {
        if (response && response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || '登录失败');
      },
      transformErrorResponse: (response: any) => {
        return {
          status: response.status,
          data: response.data,
          error: response.data?.message || `请求失败 (${response.status})`,
        };
      },
    }),
    register: builder.mutation<RegisterResponseData, RegisterRequest>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: any) => {
        if (response && response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || '注册失败');
      },
      transformErrorResponse: (response: any) => {
        return {
          status: response.status,
          data: response.data,
          error: response.data?.message || `请求失败 (${response.status})`,
        };
      },
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => {
        if (response && response.code === 200) {
          return;
        }
        throw new Error(response.message || '发送重置链接失败');
      },
      transformErrorResponse: (response: any) => {
        return {
          status: response.status,
          data: response.data,
          error: response.data?.message || `请求失败 (${response.status})`,
        };
      },
    }),
    resetPassword: builder.mutation<void, { token: string; password: string; confirmPassword: string }>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => {
        if (response && response.code === 200) {
          return;
        }
        throw new Error(response.message || '密码重置失败');
      },
      transformErrorResponse: (response: any) => {
        return {
          status: response.status,
          data: response.data,
          error: response.data?.message || `请求失败 (${response.status})`,
        };
      },
    }),

    // User
    getProfile: builder.query<User, void>({
      query: () => '/users/profile',
      providesTags: ['User'],
      transformResponse: (response: any) => {
        if (response && response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || '获取用户信息失败');
      },
      transformErrorResponse: (response: any) => {
        return {
          status: response.status,
          data: response.data,
          error: response.data?.message || `请求失败 (${response.status})`,
        };
      },
    }),
    getProfileStats: builder.query<UserStatsResponse, void>({
      query: () => '/users/profile/stats',
      providesTags: ['User'],
      transformResponse: (response: any) => unwrapResponse<UserStatsResponse>(response, '获取用户统计失败'),
    }),
    getProfileActivities: builder.query<UserActivityResponse[], void>({
      query: () => '/users/profile/activities',
      providesTags: ['User'],
      transformResponse: (response: any) => unwrapResponse<UserActivityResponse[]>(response, '获取最近活动失败'),
    }),
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (data) => ({
        url: '/users/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    uploadAvatar: builder.mutation<{ avatarUrl: string }, FormData>({
      query: (formData) => ({
        url: '/users/upload-avatar',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
      transformResponse: (response: any) => unwrapResponse<{ avatarUrl: string }>(response, '上传头像失败'),
    }),
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (data) => ({
        url: '/users/change-password',
        method: 'POST',
        body: data,
      }),
    }),
    getUserSettings: builder.query<UserSettingsResponse, void>({
      query: () => '/users/settings',
      providesTags: ['User'],
      transformResponse: (response: any) => unwrapResponse<UserSettingsResponse>(response, '获取用户设置失败'),
    }),
    updateUserSettings: builder.mutation<UserSettingsResponse, UpdateUserSettingsRequest>({
      query: (data) => ({
        url: '/users/settings',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
      transformResponse: (response: any) => unwrapResponse<UserSettingsResponse>(response, '更新用户设置失败'),
    }),
    deleteAccount: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/users/account',
        method: 'DELETE',
      }),
      transformResponse: (response: any) => unwrapResponse<{ message: string }>(response, '删除账户失败'),
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      transformResponse: (response: any) => unwrapResponse<User>(response, '获取用户详情失败'),
    }),

    // Pet
    getPets: builder.query<Pet[], void>({
      query: () => '/pets',
      providesTags: ['Pet'],
      transformResponse: (response: any) => unwrapResponse<Pet[]>(response, '获取宠物失败'),
    }),
    getPetById: builder.query<Pet, number>({
      query: (id) => `/pets/${id}`,
      transformResponse: (response: any) => unwrapResponse<Pet>(response, '获取宠物详情失败'),
    }),
    addPet: builder.mutation<Pet, CreatePetRequest>({
      query: (data) => ({
        url: '/pets',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Pet'],
      transformResponse: (response: any) => unwrapResponse<Pet>(response, '添加宠物失败'),
    }),
    updatePet: builder.mutation<Pet, UpdatePetRequest>({
      query: ({ id, ...data }) => ({
        url: `/pets/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Pet'],
      transformResponse: (response: any) => unwrapResponse<Pet>(response, '更新宠物失败'),
    }),
    deletePet: builder.mutation<void, number>({
      query: (id) => ({
        url: `/pets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Pet'],
    }),

    // Post
    getPosts: builder.query<PaginationResponse<Post>, GetPostsParams>({
      query: (params) => ({
        url: '/posts',
        params,
      }),
      transformResponse: (response: any) => unwrapPaginationResponse<Post>(response, '获取帖子失败'),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Post' as const, id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
    }),
    getPostById: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
      transformResponse: (response: any) => unwrapResponse<Post>(response, '获取帖子详情失败'),
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    checkPostLikeStatus: builder.query<{ isLiked: boolean }, number>({
      query: (id) => `/posts/${id}/like/status`,
      transformResponse: (response: any) => unwrapResponse<{ isLiked: boolean }>(response, '获取点赞状态失败'),
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    checkPostFavoriteStatus: builder.query<{ isFavorited: boolean }, number>({
      query: (id) => `/posts/${id}/favorite/status`,
      transformResponse: (response: any) => unwrapResponse<{ isFavorited: boolean }>(response, '获取收藏状态失败'),
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    createPost: builder.mutation<Post, CreatePostRequest>({
      query: (data) => ({
        url: '/posts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
      transformResponse: (response: any) => unwrapResponse<Post>(response, '发布帖子失败'),
    }),
    updatePost: builder.mutation<Post, UpdatePostRequest>({
      query: ({ id, ...data }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }, { type: 'Post', id: 'LIST' }],
      transformResponse: (response: any) => unwrapResponse<Post>(response, '更新帖子失败'),
    }),
    deletePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    likePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `/posts/${id}/like`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    unlikePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `/posts/${id}/like`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    favoritePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `/posts/${id}/favorite`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    unfavoritePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `/posts/${id}/favorite`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    getFavorites: builder.query<PaginationResponse<Post>, void>({
      query: () => '/posts/favorites',
      providesTags: [{ type: 'Post', id: 'FAVORITES' }],
      transformResponse: (response: any) => unwrapPaginationResponse<Post>(response, '获取收藏失败'),
    }),

    // Comment
    getComments: builder.query<PaginationResponse<Comment>, GetCommentsParams>({
      query: ({ postId }) => `/comments/post/${postId}`,
      transformResponse: (response: any) => {
        if (response && response.code === 200) {
          const items = response.data || [];

          return {
            items,
            total: items.length,
            page: 1,
            limit: items.length,
          };
        }

        throw new Error(response.message || '获取评论失败');
      },
      providesTags: (result, error, { postId }) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Comment' as const, id })),
              { type: 'Comment', id: `POST_${postId}` },
            ]
          : [{ type: 'Comment', id: `POST_${postId}` }],
    }),
    createComment: builder.mutation<Comment, CreateCommentRequest>({
      query: (data) => ({
        url: '/comments',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => unwrapResponse<Comment>(response, '发表评论失败'),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Comment', id: `POST_${postId}` },
        { type: 'Post', id: postId },
      ],
    }),
    updateComment: builder.mutation<Comment, UpdateCommentRequest>({
      query: ({ id, ...data }) => ({
        url: `/comments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Comment', id }],
    }),
    deleteComment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Comment', id }],
    }),
    likeComment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/comments/${id}/like`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Comment', id }],
    }),
    unlikeComment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/comments/${id}/like`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Comment', id }],
    }),

    // File
    uploadFile: builder.mutation<FileInfo, FormData>({
      query: (formData) => ({
        url: '/files/upload',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: any) => unwrapResponse<FileInfo>(response, '上传文件失败'),
    }),
    deleteFile: builder.mutation<void, number>({
      query: (id) => ({
        url: `/files/${id}`,
        method: 'DELETE',
      }),
    }),

    // Search
    search: builder.query<SearchResponse, SearchRequest>({
      query: (params) => ({
        url: '/search',
        params,
      }),
    }),

    // Tags
    getTags: builder.query<Tag[], void>({
      query: () => '/tags',
      providesTags: ['Tag'],
    }),

    // Notification
    getNotifications: builder.query<PaginationResponse<Notification>, void>({
      query: () => '/notifications',
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation<void, number>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Notification', id }],
    }),
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useGetProfileStatsQuery,
  useGetProfileActivitiesQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
  useDeleteAccountMutation,
  useGetUserByIdQuery,
  useGetPetsQuery,
  useGetPetByIdQuery,
  useAddPetMutation,
  useUpdatePetMutation,
  useDeletePetMutation,
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCheckPostLikeStatusQuery,
  useCheckPostFavoriteStatusQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useFavoritePostMutation,
  useUnfavoritePostMutation,
  useGetFavoritesQuery,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useUploadFileMutation,
  useDeleteFileMutation,
  useSearchQuery,
  useGetTagsQuery,
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = api;
