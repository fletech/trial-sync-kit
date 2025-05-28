import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MentionDropdown } from "./MentionDropdown";
import storage from "@/services/storage";
import { notificationEvents } from "@/hooks/useNotifications";

interface TaskComment {
  id: string;
  taskId: string;
  author: string;
  authorAvatar: string;
  content: string;
  mentions: string[];
  createdAt: string;
  updatedAt?: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  avatar: string;
}

interface TaskCommentsProps {
  taskId: string;
}

// Simple function to format relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

// Get current user info
const getCurrentUser = () => {
  // Try to get from team members first (if user is part of the team)
  const teamMembers = storage.getTeamMembers();
  const currentUserFromTeam = teamMembers.find(
    (member) => member.status === "active"
  );

  if (currentUserFromTeam) {
    return {
      name: currentUserFromTeam.name,
      avatar: currentUserFromTeam.avatar,
    };
  }

  // Fallback to a default user
  return {
    name: "Admin User",
    avatar:
      "https://ui-avatars.com/api/?name=Admin+User&background=5B6CFF&color=fff",
  };
};

export const TaskComments: React.FC<TaskCommentsProps> = ({ taskId }) => {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Clear previous comments first to avoid any state mixing
    setComments([]);

    // Only load comments if we have a valid taskId
    if (taskId) {
      loadComments();
    } else {
      console.warn("[TaskComments] No taskId provided");
    }
  }, [taskId]);

  const loadComments = () => {
    if (!taskId) {
      console.warn("[TaskComments] Cannot load comments: no taskId");
      return;
    }

    // Make sure we're filtering by the specific taskId
    const taskComments = storage.getTaskComments(taskId);

    setComments(taskComments);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;

    setNewComment(value);
    setCursorPosition(cursorPos);

    // Check for @ mentions - improved regex to handle names with spaces
    const textBeforeCursor = value.substring(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@([a-zA-Z\s]*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1];
      setMentionQuery(query);
      setShowMentionDropdown(true);

      // Simple positioning - just below the textarea
      if (textareaRef.current) {
        const textarea = textareaRef.current;

        setMentionPosition({
          top: textarea.offsetTop + textarea.offsetHeight + 5,
          left: textarea.offsetLeft,
        });
      }
    } else {
      setShowMentionDropdown(false);
    }
  };

  const handleMentionSelect = (member: TeamMember) => {
    const textBeforeCursor = newComment.substring(0, cursorPosition);
    const textAfterCursor = newComment.substring(cursorPosition);

    // Replace the @query with @username
    const beforeMention = textBeforeCursor.replace(
      /@[a-zA-Z\s]*$/,
      `@${member.name} `
    );
    const newText = beforeMention + textAfterCursor;

    setNewComment(newText);
    setShowMentionDropdown(false);

    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = beforeMention.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const extractMentions = (content: string): string[] => {
    // Match @Name or @Name Name but stop at common words that aren't names
    const mentionRegex = /@([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1].trim());
    }

    return mentions;
  };

  const renderCommentContent = (content: string) => {
    // Replace @mentions with highlighted spans - only capture proper names (capitalized)
    return content.replace(
      /@([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
      '<span class="text-blue-600 font-medium">@$1</span>'
    );
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const mentions = extractMentions(newComment);
    const currentUser = getCurrentUser();

    const comment: Omit<TaskComment, "id" | "createdAt"> = {
      taskId, // Make sure we're using the correct taskId
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      content: newComment,
      mentions,
    };

    const savedComment = storage.saveTaskComment(comment);

    // Create notifications for mentioned users
    mentions.forEach((mentionedUser) => {
      storage.saveNotification({
        type: "mention",
        title: "You were mentioned",
        message: `${currentUser.name} mentioned you in a task comment`,
      });
    });

    // Emit notification event
    notificationEvents.emit();

    setNewComment("");
    loadComments(); // Reload comments to show the new one
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmitComment();
    }

    // Handle mention dropdown navigation
    if (showMentionDropdown) {
      if (e.key === "Escape") {
        e.preventDefault();
        setShowMentionDropdown(false);
      }
    }
  };

  return (
    <div className="space-y-4 relative">
      <h3 className="text-lg font-medium">Comments</h3>

      {/* Comments list */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                <AvatarFallback className="text-xs">
                  {comment.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <div
                    className="text-sm text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: renderCommentContent(comment.content),
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New comment input */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={newComment}
          onChange={handleCommentChange}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment... Use @ to mention team members"
          className="min-h-[80px] resize-none"
        />

        <MentionDropdown
          isOpen={showMentionDropdown}
          onClose={() => setShowMentionDropdown(false)}
          onSelect={handleMentionSelect}
          searchQuery={mentionQuery}
          position={mentionPosition}
        />

        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            Press Ctrl+Enter to submit
          </span>
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            size="sm"
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};
