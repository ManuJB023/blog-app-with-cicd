// frontend/src/__tests__/integration/BlogApp.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';
import { blogApi } from '../../services/api';

jest.mock('../../services/api');
const mockedBlogApi = blogApi as jest.Mocked<typeof blogApi>;

describe('Blog App Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays blog posts and allows navigation', async () => {
    const mockPosts = [
      {
        id: '1',
        title: 'Integration Test Post',
        content: 'This is a test post content',
        author: 'Test Author',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: ['test']
      }
    ];

    mockedBlogApi.getAllPosts.mockResolvedValue(mockPosts);
    mockedBlogApi.getPost.mockResolvedValue(mockPosts[0]);

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Integration Test Post')).toBeInTheDocument();
    });

    // Test navigation
    fireEvent.click(screen.getByText('Integration Test Post'));

    await waitFor(() => {
      expect(mockedBlogApi.getPost).toHaveBeenCalledWith('1');
    });
  });
});