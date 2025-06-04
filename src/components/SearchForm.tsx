import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/useAppContext';

const SearchForm: React.FC = () => {
  const { searchUsers, loading, error, searchResults, selectedUser } = useAppContext();
  const [username, setUsername] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input after reset or when no user is selected
  useEffect(() => {
    if (!selectedUser && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedUser]);

  // Reset form if user is reset
  useEffect(() => {
    if (!selectedUser && searchResults.length === 0) {
      setUsername('');
    }
  }, [selectedUser, searchResults]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      await searchUsers(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-6 bg-white rounded-xl shadow w-full">
      <label htmlFor="github-username" className="sr-only">GitHub Username</label>
      <input
        ref={inputRef}
        id="github-username"
        type="text"
        className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-base sm:text-lg"
        placeholder="Enter username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        disabled={loading}
        aria-label="GitHub username"
        autoComplete="off"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md disabled:opacity-60 flex items-center justify-center text-base sm:text-lg transition-colors"
        disabled={loading || !username.trim()}
      >
        {loading ? (
          <svg className="mr-3 -ml-1 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        ) : null}
        Search
      </button>
      {error && (
        <div className="text-red-500 text-sm text-center mt-2" role="alert">{error}</div>
      )}
    </form>
  );
};

export default SearchForm;
