import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useGetPostByIdQuery,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useFavoritePostMutation,
  useUnfavoritePostMutation,
} from '../../store/services/api';
import { useAuth } from '../../hooks/useAuth';
import { Comment } from '../../types/common';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = Number(id);
  const { isAuthenticated, user } = useAuth();

  const [commentContent, setCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);

  const { data: post, isLoading: postLoading, isError: postError } = useGetPostByIdQuery(postId);
  const { data: commentsData, isLoading: commentsLoading } = useGetCommentsQuery(
    { postId, limit: 50 },
    { skip: !postId }
  );

  const [createComment, { isLoading: creatingComment }] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [favoritePost] = useFavoritePostMutation();
  const [unfavoritePost] = useUnfavoritePostMutation();

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    try {
      if (post?.isLiked) {
        await unlikePost(postId).unwrap();
      } else {
        await likePost(postId).unwrap();
      }
    } catch (err) {
      console.error('Failed to like:', err);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    try {
      if (post?.isFavorited) {
        await unfavoritePost(postId).unwrap();
      } else {
        await favoritePost(postId).unwrap();
      }
    } catch (err) {
      console.error('Failed to favorite:', err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    if (!commentContent.trim()) return;

    try {
      await createComment({
        postId,
        parentId: replyingTo || undefined,
        content: commentContent.trim(),
      }).unwrap();
      setCommentContent('');
      setReplyingTo(null);
    } catch (err) {
      console.error('Failed to create comment:', err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('确定要删除这条评论吗？')) return;
    try {
      await deleteComment(commentId).unwrap();
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
            帖子不存在或已被删除
          </div>
          <div className="text-center mt-4">
            <Link to="/posts" className="text-purple-600 hover:text-purple-700">
              返回帖子列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const comments = commentsData?.items || [];
  const topLevelComments = comments.filter((c) => !c.parentId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Post Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {post.coverUrl && (
            <div className="aspect-video overflow-hidden">
              <img
                src={post.coverUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

            {/* Author info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={post.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.username || post.userId}`}
                  alt={post.user?.nickname}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {post.user?.nickname || post.user?.username || '用户'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border ${
                    post.isLiked
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {post.likeCount}
                </button>

                <button
                  onClick={handleFavorite}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border ${
                    post.isFavorited
                      ? 'border-yellow-300 bg-yellow-50 text-yellow-600'
                      : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill={post.isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  收藏
                </button>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {post.content}
            </div>

            {/* Post stats */}
            <div className="flex items-center gap-6 mt-8 pt-6 border-t text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.viewCount} 浏览
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {post.commentCount} 评论
              </span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            评论 ({post.commentCount})
          </h2>

          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="bg-white rounded-lg shadow-md p-4 mb-6">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder={replyingTo ? `回复评论...` : '发表你的看法...'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={replyingTo ? 2 : 3}
              />
              <div className="flex justify-between items-center mt-3">
                {replyingTo && (
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    取消回复
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!commentContent.trim() || creatingComment}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                >
                  {creatingComment ? '发送中...' : '发送评论'}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center mb-6">
              <p className="text-gray-600 mb-4">登录后参与评论</p>
              <Link
                to="/auth/login"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium"
              >
                登录
              </Link>
            </div>
          )}

          {/* Comments List */}
          {commentsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : topLevelComments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              暂无评论，来发表第一个评论吧！
            </div>
          ) : (
            <div className="space-y-4">
              {(showAllComments ? comments : topLevelComments).map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  replies={comments.filter((c) => c.parentId === comment.id)}
                  currentUserId={user?.id}
                  onReply={() => setReplyingTo(comment.id)}
                  onDelete={handleDeleteComment}
                  formatRelativeDate={formatRelativeDate}
                />
              ))}
            </div>
          )}

          {!showAllComments && topLevelComments.length < comments.length && (
            <button
              onClick={() => setShowAllComments(true)}
              className="w-full mt-4 py-3 text-purple-600 hover:text-purple-700 font-medium"
            >
              查看全部 {comments.length} 条评论
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  currentUserId?: number;
  onReply: () => void;
  onDelete: (id: number) => void;
  formatRelativeDate: (date: string) => string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  replies,
  currentUserId,
  onReply,
  onDelete,
  formatRelativeDate,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start gap-3">
        <img
          src={comment.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.username || comment.userId}`}
          alt={comment.user?.nickname}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {comment.user?.nickname || comment.user?.username || '用户'}
            </span>
            <span className="text-xs text-gray-500">
              {formatRelativeDate(comment.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-gray-700">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={onReply}
              className="text-sm text-gray-500 hover:text-purple-600"
            >
              回复
            </button>
            {currentUserId === comment.userId && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-sm text-gray-500 hover:text-red-600"
              >
                删除
              </button>
            )}
          </div>

          {/* Replies */}
          {replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-3">
              {replies.map((reply) => (
                <div key={reply.id} className="flex items-start gap-2">
                  <img
                    src={reply.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.user?.username || reply.userId}`}
                    alt={reply.user?.nickname}
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">
                        {reply.user?.nickname || reply.user?.username || '用户'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatRelativeDate(reply.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-gray-700 text-sm">{reply.content}</p>
                    {currentUserId === reply.userId && (
                      <button
                        onClick={() => onDelete(reply.id)}
                        className="text-xs text-gray-500 hover:text-red-600 mt-1"
                      >
                        删除
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
