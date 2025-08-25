import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BlogList from './components/BlogList/BlogList';
import './App.css';

// Simple CreatePost component
const CreatePost = () => {
  const [formData, setFormData] = React.useState({
    title: '',
    content: '',
    author: '',
    tags: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch(process.env.REACT_APP_API_URL + '/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      })
    });

    if (response.ok) {
      alert('Post created successfully!');
      setFormData({ title: '', content: '', author: '', tags: '' });
    } else {
      alert('Failed to create post');
    }
  };

  return (
    <div style={{maxWidth: '600px', margin: '0 auto'}}>
      <h2>Create New Post</h2>
      <Link to="/" style={{marginBottom: '20px', display: 'inline-block'}}>← Back to Posts</Link>
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
        <input
          type="text"
          placeholder="Post Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
          style={{padding: '10px', fontSize: '16px'}}
        />
        <input
          type="text"
          placeholder="Author Name"
          value={formData.author}
          onChange={(e) => setFormData({...formData, author: e.target.value})}
          required
          style={{padding: '10px', fontSize: '16px'}}
        />
        <textarea
          placeholder="Post Content"
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          required
          rows={6}
          style={{padding: '10px', fontSize: '16px'}}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={(e) => setFormData({...formData, tags: e.target.value})}
          style={{padding: '10px', fontSize: '16px'}}
        />
        <button type="submit" style={{padding: '12px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px'}}>
          Create Post
        </button>
      </form>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <header style={{backgroundColor: '#343a40', color: 'white', padding: '20px', textAlign: 'center'}}>
          <h1>My Blog</h1>
          <nav>
            <Link to="/" style={{color: 'white', margin: '0 10px'}}>Home</Link>
            <Link to="/create" style={{color: 'white', margin: '0 10px'}}>Create Post</Link>
          </nav>
        </header>
        <main style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/create" element={<CreatePost />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
