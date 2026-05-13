import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from './ProtectedRoute';
import PageSkeleton from '../components/PageSkeleton';

const HomePage = React.lazy(() => import('../features/home'));
const PostListPage = React.lazy(() => import('../features/postList'));
const PostDetailPage = React.lazy(() => import('../features/postDetail'));
const PostCreatePage = React.lazy(() => import('../features/postCreate'));
const SearchPage = React.lazy(() => import('../features/search'));

const LoginPage = React.lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('../features/auth/pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('../features/auth/pages/ResetPasswordPage'));

const ProfilePage = React.lazy(() => import('../features/user/pages/ProfilePage'));
const EditProfilePage = React.lazy(() => import('../features/user/pages/EditProfilePage'));
const ChangePasswordPage = React.lazy(() => import('../features/user/pages/ChangePasswordPage'));
const SettingsPage = React.lazy(() => import('../features/user/pages/SettingsPage'));
const MyPetsPage = React.lazy(() => import('../features/user/pages/MyPetsPage'));
const MyPostsPage = React.lazy(() => import('../features/user/pages/MyPostsPage'));
const MyFavoritesPage = React.lazy(() => import('../features/user/pages/MyFavoritesPage'));

const SuspenseFallback = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/auth',
    children: [
      { path: 'login', element: <SuspenseFallback><LoginPage /></SuspenseFallback> },
      { path: 'register', element: <SuspenseFallback><RegisterPage /></SuspenseFallback> },
      { path: 'forgot-password', element: <SuspenseFallback><ForgotPasswordPage /></SuspenseFallback> },
      { path: 'reset-password', element: <SuspenseFallback><ResetPasswordPage /></SuspenseFallback> },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'posts', element: <SuspenseFallback><PostListPage /></SuspenseFallback> },
      { path: 'posts/:id', element: <SuspenseFallback><PostDetailPage /></SuspenseFallback> },
      { path: 'posts/create', element: <ProtectedRoute><SuspenseFallback><PostCreatePage /></SuspenseFallback></ProtectedRoute> },
      { path: 'search', element: <SuspenseFallback><SearchPage /></SuspenseFallback> },
      { path: 'profile', element: <ProtectedRoute><SuspenseFallback><ProfilePage /></SuspenseFallback></ProtectedRoute> },
      { path: 'profile/edit', element: <ProtectedRoute><SuspenseFallback><EditProfilePage /></SuspenseFallback></ProtectedRoute> },
      { path: 'profile/change-password', element: <ProtectedRoute><SuspenseFallback><ChangePasswordPage /></SuspenseFallback></ProtectedRoute> },
      { path: 'profile/settings', element: <ProtectedRoute><SuspenseFallback><SettingsPage /></SuspenseFallback></ProtectedRoute> },
      { path: 'profile/pets', element: <ProtectedRoute><SuspenseFallback><MyPetsPage /></SuspenseFallback></ProtectedRoute> },
      { path: 'profile/posts', element: <ProtectedRoute><SuspenseFallback><MyPostsPage /></SuspenseFallback></ProtectedRoute> },
      { path: 'profile/favorites', element: <ProtectedRoute><SuspenseFallback><MyFavoritesPage /></SuspenseFallback></ProtectedRoute> },
    ],
  },
]);

export default router;
