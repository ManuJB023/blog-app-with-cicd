import React, { useEffect, useState } from "react";
import { getPosts, createPost } from "./api";

interface Post {
  id: string;
  title: string;
  content: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setError(null);
      const data = await getPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again.");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Please fill in both title and content.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createPost({ 
        title: title.trim(), 
        content: content.trim(),
        author: author.trim() || "Anonymous"
      });
      
      setSuccess("Post created successfully!");
      setTitle("");
      setContent("");
      setAuthor("");
      
      // Refresh posts
      await fetchPosts();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const dismissError = () => setError(null);
  const dismissSuccess = () => setSuccess(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">MyBlog</h1>
          <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <li>
              <a href="#home" className="hover:text-blue-600 transition-colors duration-200">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-blue-600 transition-colors duration-200">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-blue-600 transition-colors duration-200">
                Contact
              </a>
            </li>
          </ul>
          {/* Mobile menu button */}
          <button className="md:hidden text-gray-700 hover:text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full py-8 px-4 sm:px-6">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={dismissError}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex justify-between items-center">
            <span>{success}</span>
            <button 
              onClick={dismissSuccess}
              className="text-green-500 hover:text-green-700 ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Create Post Form */}
        <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
            Create a New Post
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
                maxLength={200}
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author (optional)
              </label>
              <input
                id="author"
                type="text"
                placeholder="Your name (defaults to Anonymous)"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                id="content"
                placeholder="Write your content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-y transition-all duration-200"
                disabled={loading}
                maxLength={5000}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {content.length}/5000 characters
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? "Creating..." : "Create Post"}
            </button>
          </form>
        </section>

        {/* Posts List */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            Latest Posts 
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({posts.length} {posts.length === 1 ? 'post' : 'posts'})
            </span>
          </h2>
          
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((post) => (
                  <article
                    key={post.id}
                    className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow duration-200 border border-gray-100"
                  >
                    <header className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
                        {post.title}
                      </h3>
                      <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {post.author || "Anonymous"}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </header>
                    <div className="text-gray-700 leading-relaxed">
                      {post.content}
                    </div>
                  </article>
                ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner border-t py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} MyBlog. Built with React and AWS.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Serverless • Scalable • Modern
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;