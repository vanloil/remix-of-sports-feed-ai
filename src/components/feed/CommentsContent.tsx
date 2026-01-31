import { useState, useEffect } from 'react';
import { MessageCircle, ChevronUp, ChevronDown, Reply, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  replies: Comment[];
  createdAt: string;
}

interface CommentsContentProps {
  cardId: string;
  onCommentCountChange: (count: number) => void;
}

// Mock comments storage (in production this would be in a database)
const getStoredComments = (cardId: string): Comment[] => {
  const stored = localStorage.getItem(`comments_${cardId}`);
  return stored ? JSON.parse(stored) : [];
};

const saveComments = (cardId: string, comments: Comment[]) => {
  localStorage.setItem(`comments_${cardId}`, JSON.stringify(comments));
};

export const CommentsContent = ({ cardId, onCommentCountChange }: CommentsContentProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    const storedComments = getStoredComments(cardId);
    setComments(storedComments);
    updateCommentCount(storedComments);
  }, [cardId]);

  const countAllComments = (comments: Comment[]): number => {
    return comments.reduce((total, comment) => {
      return total + 1 + countAllComments(comment.replies);
    }, 0);
  };

  const updateCommentCount = (comments: Comment[]) => {
    const count = countAllComments(comments);
    onCommentCountChange(count);
  };

  const handlePostComment = () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      content: newComment.trim(),
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      replies: [],
      createdAt: new Date().toISOString(),
    };

    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    saveComments(cardId, updatedComments);
    updateCommentCount(updatedComments);
    setNewComment('');
  };

  const handlePostReply = (parentId: string) => {
    if (!user || !replyContent.trim()) return;

    const reply: Comment = {
      id: `r_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      content: replyContent.trim(),
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      replies: [],
      createdAt: new Date().toISOString(),
    };

    const addReply = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === parentId) {
          return { ...comment, replies: [...comment.replies, reply] };
        }
        return { ...comment, replies: addReply(comment.replies) };
      });
    };

    const updatedComments = addReply(comments);
    setComments(updatedComments);
    saveComments(cardId, updatedComments);
    updateCommentCount(updatedComments);
    setReplyingTo(null);
    setReplyContent('');
  };

  const handleVote = (commentId: string, voteType: 'up' | 'down') => {
    const updateVote = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          const wasUpvoted = comment.userVote === 'up';
          const wasDownvoted = comment.userVote === 'down';
          
          let newUpvotes = comment.upvotes;
          let newDownvotes = comment.downvotes;
          let newUserVote: 'up' | 'down' | null = voteType;

          if (voteType === 'up') {
            if (wasUpvoted) {
              newUpvotes--;
              newUserVote = null;
            } else {
              newUpvotes++;
              if (wasDownvoted) newDownvotes--;
            }
          } else {
            if (wasDownvoted) {
              newDownvotes--;
              newUserVote = null;
            } else {
              newDownvotes++;
              if (wasUpvoted) newUpvotes--;
            }
          }

          return {
            ...comment,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVote: newUserVote,
          };
        }
        return { ...comment, replies: updateVote(comment.replies) };
      });
    };

    const updatedComments = updateVote(comments);
    setComments(updatedComments);
    saveComments(cardId, updatedComments);
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return t('time.justNow');
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  if (!user) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground text-center py-8">
          {t('auth.loginRequired')}
        </p>
        
        <button 
          onClick={() => navigate('/auth')}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          {t('auth.login')}
        </button>
      </div>
    );
  }

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const score = comment.upvotes - comment.downvotes;
    const maxDepth = 3;

    return (
      <div className={cn("animate-fade-in", depth > 0 && "ml-4 pl-4 border-l-2 border-border")}>
        <div className="py-3">
          {/* Comment header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
              {comment.userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium">{comment.userName}</span>
            <span className="text-xs text-muted-foreground">{getTimeAgo(comment.createdAt)}</span>
          </div>

          {/* Comment content */}
          <p className="text-sm mb-2">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Voting */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleVote(comment.id, 'up')}
                className={cn(
                  "p-1 rounded hover:bg-muted transition-colors",
                  comment.userVote === 'up' && "text-primary"
                )}
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <span className={cn(
                "text-xs font-medium min-w-[2ch] text-center",
                score > 0 && "text-primary",
                score < 0 && "text-destructive"
              )}>
                {score}
              </span>
              <button
                onClick={() => handleVote(comment.id, 'down')}
                className={cn(
                  "p-1 rounded hover:bg-muted transition-colors",
                  comment.userVote === 'down' && "text-destructive"
                )}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Reply button */}
            {depth < maxDepth && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Reply className="w-3 h-3" />
                {t('comments.reply')}
              </button>
            )}
          </div>

          {/* Reply input */}
          {replyingTo === comment.id && (
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={t('comments.writeReply')}
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => e.key === 'Enter' && handlePostReply(comment.id)}
              />
              <button
                onClick={() => handlePostReply(comment.id)}
                disabled={!replyContent.trim()}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Nested replies */}
        {comment.replies.length > 0 && (
          <div>
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Comment input */}
      <div className="flex gap-2">
        <input 
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={t('comments.write')}
          className="flex-1 px-4 py-3 rounded-xl bg-muted border-none focus:ring-2 focus:ring-primary"
          onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
        />
        <button 
          onClick={handlePostComment}
          disabled={!newComment.trim()}
          className="px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50"
        >
          {t('comments.post')}
        </button>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>{t('comments.empty')}</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};
