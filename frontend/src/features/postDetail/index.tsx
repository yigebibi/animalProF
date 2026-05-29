import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useGetPostByIdQuery,
  useCheckPostFavoriteStatusQuery,
  useCheckPostLikeStatusQuery,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useFavoritePostMutation,
  useUnfavoritePostMutation,
} from '../../store/services/api';
import { useAuth } from '../../hooks/useAuth';
import { Comment } from '../../types/common';
import { formatRelativeDate } from '../../utils/date';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = Number(id);
  const { isAuthenticated, user } = useAuth();

  const [commentContent, setCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);

  const { data: post, isLoading: postLoading, isError: postError } = useGetPostByIdQuery(postId);
  const { data: likeStatus } = useCheckPostLikeStatusQuery(postId, {
    skip: !postId || !isAuthenticated,
  });
  const { data: favoriteStatus } = useCheckPostFavoriteStatusQuery(postId, {
    skip: !postId || !isAuthenticated,
  });
  const { data: commentsData, isLoading: commentsLoading } = useGetCommentsQuery(
    { postId, limit: 50 },
    { skip: !postId }
  );

  const [createComment, { isLoading: creatingComment }] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [favoritePost] = useFavoritePostMutation();
  const [unfavoritePost] = useUnfavoritePostMutation();
  const [likeComment] = useLikeCommentMutation();
  const [unlikeComment] = useUnlikeCommentMutation();
  const isLiked = likeStatus?.isLiked ?? false;
  const isFavorited = favoriteStatus?.isFavorited ?? false;

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    try {
      if (isLiked) {
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
      if (isFavorited) {
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

  const handleUpdateComment = async (commentId: number, content: string) => {
    try {
      await updateComment({ id: commentId, content }).unwrap();
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    try {
      await likeComment(commentId).unwrap();
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  };

  const handleUnlikeComment = async (commentId: number) => {
    try {
      await unlikeComment(commentId).unwrap();
    } catch (err) {
      console.error('Failed to unlike comment:', err);
    }
  };

  const formatDateFull = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-transparent py-8">
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
      <div className="min-h-screen bg-transparent py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-center text-rose-700 shadow-[0_16px_35px_rgba(99,74,137,0.08)]">
            帖子不存在或已被删除
          </div>
          <div className="text-center mt-4">
            <Link to="/posts" className="font-semibold text-rose-500 hover:text-rose-600">
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
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to="/posts"
          className="mb-6 inline-flex items-center rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] shadow-[0_12px_25px_rgba(99,74,137,0.08)] hover:text-[color:var(--ink-deep)]"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回帖子列表
        </Link>

        {/* Post Content */}
        <div className="overflow-hidden rounded-[32px] border border-white/80 bg-white/88 shadow-[0_22px_55px_rgba(99,74,137,0.12)]">
          {post.coverUrl && (
            <div className="aspect-video overflow-hidden bg-gradient-to-br from-amber-100 via-rose-50 to-sky-100">
              <img
                src={post.coverUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-7 sm:p-8">
            {/* Title */}
            <div className="mb-3 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
              Pet Story
            </div>
            <h1 className="mb-4 text-3xl font-black text-[color:var(--ink-deep)] sm:text-4xl">{post.title}</h1>

            {/* Author info */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.username || post.userId}`}
                  alt={post.user?.nickname}
                  className="h-12 w-12 rounded-full border border-amber-100 object-cover"
                />
                <div>
                  <div className="font-semibold text-[color:var(--ink-deep)]">
                    {post.user?.nickname || post.user?.username || '用户'}
                  </div>
                  <div className="text-sm text-[color:var(--ink-soft)]">
                    {formatDateFull(post.createdAt)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    isLiked
                      ? 'border border-rose-200 bg-rose-50 text-rose-600'
                      : 'border border-white/80 bg-white/80 text-[color:var(--ink-soft)] hover:text-[color:var(--ink-deep)]'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {post.likeCount}
                </button>

                <button
                  onClick={handleFavorite}
                  className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    isFavorited
                      ? 'border border-amber-200 bg-amber-50 text-amber-600'
                      : 'border border-white/80 bg-white/80 text-[color:var(--ink-soft)] hover:text-[color:var(--ink-deep)]'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
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
                    className="rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none whitespace-pre-wrap leading-8 text-[color:var(--ink-deep)]">
              {post.content}
            </div>

            {/* Post stats */}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[color:var(--line-soft)] pt-6 text-sm text-[color:var(--ink-soft)]">
              <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.viewCount} 浏览
              </span>
              <span className="flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5">
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
          <h2 className="mb-6 text-2xl font-black text-[color:var(--ink-deep)]">
            评论 ({post.commentCount})
          </h2>

          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mb-6 rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_18px_40px_rgba(99,74,137,0.10)]">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder={replyingTo ? `回复评论...` : '发表你的看法...'}
                className="w-full resize-none rounded-[22px] border border-[color:var(--line-soft)] bg-[rgba(255,250,244,0.76)] px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-300"
                rows={replyingTo ? 2 : 3}
              />
              <div className="flex justify-between items-center mt-3">
                {replyingTo && (
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="text-sm font-medium text-[color:var(--ink-soft)] hover:text-[color:var(--ink-deep)]"
                  >
                    取消回复
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!commentContent.trim() || creatingComment}
                  className="ml-auto rounded-full bg-[color:var(--ink-deep)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(78,56,120,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingComment ? '发送中...' : '发送评论'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-6 rounded-[28px] border border-white/80 bg-white/85 p-6 text-center shadow-[0_18px_40px_rgba(99,74,137,0.10)]">
              <p className="mb-4 text-[color:var(--ink-soft)]">登录后参与评论</p>
              <Link
                to="/auth/login"
                className="rounded-full bg-[color:var(--ink-deep)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(78,56,120,0.18)]"
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
            <div className="rounded-[28px] border border-white/80 bg-white/85 p-8 text-center text-[color:var(--ink-soft)] shadow-[0_18px_40px_rgba(99,74,137,0.10)]">
              暂无评论，来发表第一个评论吧！
            </div>
          ) : (
            <div className="space-y-4">
              {(showAllComments ? comments : topLevelComments).map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  replies={comment.replies || []}
                  currentUserId={user?.id}
                  onReply={() => setReplyingTo(comment.id)}
                  onDelete={handleDeleteComment}
                  onUpdate={handleUpdateComment}
                  onLike={handleLikeComment}
                  onUnlike={handleUnlikeComment}
                  formatRelativeDate={formatRelativeDate}
                  updatingCommentId={null}
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
  onUpdate: (id: number, content: string) => void;
  onLike: (id: number) => void;
  onUnlike: (id: number) => void;
  formatRelativeDate: (date: string) => string;
  updatingCommentId?: number | null;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  replies,
  currentUserId,
  onReply,
  onDelete,
  onUpdate,
  onLike,
  onUnlike,
  formatRelativeDate,
  updatingCommentId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isLiked, setIsLiked] = useState(false);

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      onUpdate(comment.id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleToggleLike = () => {
    if (isLiked) {
      onUnlike(comment.id);
      setIsLiked(false);
    } else {
      onLike(comment.id);
      setIsLiked(true);
    }
  };

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
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                rows={3}
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={updatingCommentId === comment.id || !editContent.trim()}
                  className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  {updatingCommentId === comment.id ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-gray-700">{comment.content}</p>
          )}
          {!isEditing && (
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={onReply}
                className="text-sm text-gray-500 hover:text-purple-600"
              >
                回复
              </button>
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1 text-sm ${isLiked ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'}`}
              >
                <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {comment.likeCount > 0 && comment.likeCount}
              </button>
              {currentUserId === comment.userId && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-gray-500 hover:text-purple-600"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="text-sm text-gray-500 hover:text-red-600"
                  >
                    删除
                  </button>
                </>
              )}
            </div>
          )}

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
                    <div className="flex items-center gap-3 mt-1">
                      <button
                        onClick={() => {
                          onLike(reply.id);
                        }}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-rose-500"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {reply.likeCount > 0 && reply.likeCount}
                      </button>
                      {currentUserId === reply.userId && (
                        <>
                          <button
                            onClick={() => onDelete(reply.id)}
                            className="text-xs text-gray-400 hover:text-red-600"
                          >
                            删除
                          </button>
                        </>
                      )}
                    </div>
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
