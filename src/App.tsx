import React from 'react';
import { AppProvider } from './context/AppContext';
import SearchForm from './components/SearchForm';
import UserList from './components/UserList';

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center py-4 text-sm text-gray-500">
      <a 
        href="https://github.com/ahmadlufiau/github-repositories-explorer" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:text-blue-600 transition-colors inline-flex items-center"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className="w-3 h-3 mr-1"
          fill="currentColor"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        Source
      </a>
    </footer>
  );
};

const MainContent: React.FC = () => {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4 md:gap-8 px-2 sm:px-4">
      <header className="mb-2 md:mb-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-700 mb-1">GitHub Repositories Explorer</h1>
        <p className="text-gray-500 text-sm md:text-base">Search users and explore their repositories</p>
      </header>
      <SearchForm />
      <UserList />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-2 sm:p-4">
          <MainContent />
        </div>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
