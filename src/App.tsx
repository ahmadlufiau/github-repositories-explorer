import React from 'react';
import { AppProvider } from './context/AppContext';
import SearchForm from './components/SearchForm';
import UserList from './components/UserList';

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
        <MainContent />
      </div>
    </AppProvider>
  );
}

export default App;
