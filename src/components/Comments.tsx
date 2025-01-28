import React, { useEffect, useState } from 'react';
import { Octokit } from '@octokit/rest';

interface CommentsProps {
  discussionId: string;
}

interface Comment {
  id: string;
  author: {
    login: string;
    avatarUrl: string;
  };
  body: string;
  createdAt: string;
}

interface DiscussionResponse {
  node: {
    comments: {
      nodes: Comment[];
    };
  };
}

export default function Comments({ discussionId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComments();
  }, [discussionId]);

  const fetchComments = async () => {
    try {
      const octokit = new Octokit({
        auth: import.meta.env.PUBLIC_GITHUB_TOKEN
      });

      const response = await octokit.graphql<DiscussionResponse>(`
        query($discussionId: ID!) {
          node(id: $discussionId) {
            ... on Discussion {
              comments(first: 100) {
                nodes {
                  id
                  author {
                    login
                    avatarUrl
                  }
                  body
                  createdAt
                }
              }
            }
          }
        }
      `, {
        discussionId
      });

      setComments(response.node.comments.nodes);
    } catch (err) {
      setError('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    try {
      const octokit = new Octokit({
        auth: import.meta.env.PUBLIC_GITHUB_TOKEN
      });

      await octokit.graphql(`
        mutation($discussionId: ID!, $body: String!) {
          addDiscussionComment(input: {
            discussionId: $discussionId,
            body: $body
          }) {
            comment {
              id
            }
          }
        }
      `, {
        discussionId,
        body: newComment
      });

      setNewComment('');
      fetchComments();
    } catch (err) {
      setError('Failed to post comment');
    }
  };

  if (isLoading) return <div>Loading comments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="comments-section">
      <h2>Comments</h2>
      
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <img 
                src={comment.author.avatarUrl} 
                alt={comment.author.login} 
                className="avatar"
              />
              <span className="author">{comment.author.login}</span>
              <span className="date">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="comment-body">{comment.body}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="comment-input"
        />
        <button type="submit" className="submit-button">
          Post Comment
        </button>
      </form>
    </div>
  );
}