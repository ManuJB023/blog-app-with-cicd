import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types/blog';
import { blogApi } from '../../services/api';

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await blogApi.getAllPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        setError('Error loading posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div className="blog-list">
      <h2>Blog Posts</h2>
      <div style={{marginBottom: '20px'}}>
        <Link to="/create" style={{padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px'}}>
          Create New Post
        </Link>
      </div>
      {posts.length === 0 ? (
        <p>No posts available. <Link to="/create">Create your first post!</Link></p>
      ) : (
        <div>
          {posts.map(post => (
            <div key={post.id} style={{border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '4px'}}>
              <h3>
                <Link to={`/post/${post.id}`} style={{textDecoration: 'none', color: '#007bff'}}>
                  {post.title}
                </Link>
              </h3>
              <p><strong>By:</strong> {post.author}</p>
              <p><strong>Created:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
              <p>{post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}</p>
              <div>
                {post.tags.map(tag => (
                  <span key={tag} style={{backgroundColor: '#e9ecef', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8em', marginRight: '5px'}}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
