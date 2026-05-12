import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from './ProtectedRoute';

// 懒加载页面组件
const HomePage = React.lazy(() => import('../features/home'));
const PostListPage = React.lazy(() => import('../features/postList'));
const PostDetailPage = React.lazy(() => import('../features/postDetail'));
const PostCreatePage = React.lazy(() => import('../features/postCreate'));
const SearchPage = React.lazy(() => import('../features/search'));

// 认证相关页面
const LoginPage = React.lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('../features/auth/pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('../features/auth/pages/ResetPasswordPage'));

// 用户个人中心页面
const ProfilePage = React.lazy(() => import('../features/user/pages/ProfilePage'));
const EditProfilePage = React.lazy(() => import('../features/user/pages/EditProfilePage'));
const ChangePasswordPage = React.lazy(() => import('../features/user/pages/ChangePasswordPage'));
const SettingsPage = React.lazy(() => import('../features/user/pages/SettingsPage'));
const MyPetsPage = React.lazy(() => import('../features/user/pages/MyPetsPage'));
const MyPostsPage = React.lazy(() => import('../features/user/pages/MyPostsPage'));
const MyFavoritesPage = React.lazy(() => import('../features/user/pages/MyFavoritesPage'));

export const router = createBrowserRouter([
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <LoginPage />
          </React.Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <RegisterPage />
          </React.Suspense>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <ForgotPasswordPage />
          </React.Suspense>
        ),
      },
      {
        path: 'reset-password',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordPage />
          </React.Suspense>
        ),
      },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <HomePage />
          </React.Suspense>
        ),
      },
      {
        path: 'posts',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <PostListPage />
          </React.Suspense>
        ),
      },
      {
        path: 'posts/:id',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <PostDetailPage />
          </React.Suspense>
        ),
      },
      {
        path: 'posts/create',
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <PostCreatePage />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'search',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <SearchPage />
          </React.Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <ProfilePage />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/edit',
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <EditProfilePage />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/change-password',
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <ChangePasswordPage />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/settings',
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <SettingsPage />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/pets',
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <MyPetsPage />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/posts',
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <MyPostsPage />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/favorites',
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <MyFavoritesPage />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
