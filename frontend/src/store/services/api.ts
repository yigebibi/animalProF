import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import {
  LoginRequest,
  LoginResponseData,
  RegisterRequest,
  RegisterResponseData,
  UpdateProfileRequest,
  ChangePasswordRequest,
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
    }),
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (data) => ({
        url: '/users/change-password',
        method: 'POST',
        body: data,
      }),
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
    }),

    // Pet
    getPets: builder.query<Pet[], void>({
      query: () => '/pets',
      providesTags: ['Pet'],
    }),
    getPetById: builder.query<Pet, number>({
      query: (id) => `/pets/${id}`,
    }),
    addPet: builder.mutation<Pet, CreatePetRequest>({
      query: (data) => ({
        url: '/pets',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Pet'],
    }),
    updatePet: builder.mutation<Pet, UpdatePetRequest>({
      query: ({ id, ...data }) => ({
        url: `/pets/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Pet'],
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
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    createPost: builder.mutation<Post, CreatePostRequest>({
      query: (data) => ({
        url: '/posts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    updatePost: builder.mutation<Post, UpdatePostRequest>({
      query: ({ id, ...data }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }, { type: 'Post', id: 'LIST' }],
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
        url: `/posts/${id}/unlike`,
        method: 'POST',
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
        url: `/posts/${id}/unfavorite`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
    }),

    // Comment
    getComments: builder.query<PaginationResponse<Comment>, GetCommentsParams>({
      query: (params) => ({
        url: '/comments',
        params,
      }),
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
        url: `/comments/${id}/unlike`,
        method: 'POST',
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
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useGetUserByIdQuery,
  useGetPetsQuery,
  useGetPetByIdQuery,
  useAddPetMutation,
  useUpdatePetMutation,
  useDeletePetMutation,
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useFavoritePostMutation,
  useUnfavoritePostMutation,
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
