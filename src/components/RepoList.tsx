import React from 'react';
import { useAppContext } from '../context/useAppContext';
import RepoCard from './RepoCard';

const RepoList: React.FC = () => {
  const { selectedUser, repos, searchResults, selectUser, loading, error } = useAppContext();

  if (!selectedUser) return null;

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md flex flex-col h-full">
      {/* User dropdown */}
      <div className="mb-4">
        <select
          className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
          value={selectedUser.login}
          onChange={e => {
            const user = searchResults.find(u => u.login === e.target.value);
            if (user) selectUser(user);
          }}
          disabled={loading}
        >
          {searchResults.map(user => (
            <option key={user.id} value={user.login}>{user.login}</option>
          ))}
        </select>
      </div>
      {/* Repo list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <svg className="mr-3 -ml-1 size-5 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm text-center py-4" role="alert">{error}</div>
        ) : repos.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-4">No repositories found.</div>
        ) : (
          <ul className="space-y-4">
            {repos.map(repo => (
              <li key={repo.id}>
                <RepoCard repo={repo} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RepoList;
