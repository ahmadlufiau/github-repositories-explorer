import React from 'react';
import { AppProvider } from './context/AppContext';
import SearchForm from './components/SearchForm';
import UserList from './components/UserList';

const MainContent: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <SearchForm />
      <UserList />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <MainContent />
      </div>
    </AppProvider>
  );
}

export default App;
