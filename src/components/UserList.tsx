import React, { useState } from 'react';
import { useAppContext } from '../context/useAppContext';
import RepoCard from './RepoCard';
import { getUserRepos } from '../services/githubApi';
import type { GithubRepo, GithubUser } from '../services/githubApi';

interface UserRepoState {
  loading: boolean;
  error: string | null;
  repos: GithubRepo[];
}

const UserList: React.FC = () => {
  const { searchResults, loading, searchQuery } = useAppContext();
  const [openUserId, setOpenUserId] = useState<number | null>(null);
  const [userRepos, setUserRepos] = useState<Record<number, UserRepoState>>({});

  if (loading || searchResults.length === 0) return null;

  const handleAccordionClick = async (user: GithubUser) => {
    if (openUserId === user.id) {
      setOpenUserId(null);
      return;
    }
    setOpenUserId(user.id);
    if (!userRepos[user.id]) {
      setUserRepos(prev => ({
        ...prev,
        [user.id]: { loading: true, error: null, repos: [] },
      }));
      try {
        const repos = await getUserRepos(user.login);
        setUserRepos(prev => ({
          ...prev,
          [user.id]: { loading: false, error: null, repos },
        }));
      } catch (e: unknown) {
        const message = typeof e === 'object' && e && 'message' in e ? (e as { message?: string }).message : 'Error fetching repos';
        setUserRepos(prev => ({
          ...prev,
          [user.id]: { loading: false, error: message ?? 'Error fetching repos', repos: [] },
        }));
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow p-3 sm:p-6">
      <div className="mb-3 text-sm text-gray-600">
        Showing users for {searchQuery ? <span className="font-semibold">"{searchQuery}"</span> : 'your search'}
      </div>
      <ul className="divide-y">
        {searchResults.map(user => {
          const isOpen = openUserId === user.id;
          const repoState = userRepos[user.id];
          return (
            <li key={user.id} className="py-2">
              <button
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 text-left ${isOpen ? 'bg-blue-100 border border-blue-400 font-semibold shadow' : 'hover:bg-blue-50'}`}
                onClick={() => handleAccordionClick(user)}
                aria-expanded={isOpen}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <img src={user.avatar_url} alt={user.login} className="w-8 h-8 rounded-full mr-3 border" />
                <span className="truncate flex-1 text-base sm:text-lg">{user.login}</span>
                <svg className={`ml-2 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isOpen && (
                <div className="mt-3 ml-0 sm:ml-12">
                  {repoState?.loading ? (
                    <div className="flex justify-center py-4">
                      <svg className="mr-3 -ml-1 size-5 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    </div>
                  ) : repoState?.error ? (
                    <div className="text-red-500 text-sm py-2">{repoState.error}</div>
                  ) : repoState?.repos.length === 0 ? (
                    <div className="text-gray-500 text-sm py-2">No repositories found.</div>
                  ) : (
                    <ul className="space-y-3">
                      {repoState.repos.map(repo => (
                        <li key={repo.id}>
                          <RepoCard repo={repo} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserList;
