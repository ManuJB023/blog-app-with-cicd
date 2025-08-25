import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <header role="banner">
        <h1>My Blog</h1>
      </header>
      <main role="main">{children}</main>
      <footer role="contentinfo">
        <p>&copy; 2024 Blog App</p>
      </footer>
    </div>
  );
};

export default Layout;
