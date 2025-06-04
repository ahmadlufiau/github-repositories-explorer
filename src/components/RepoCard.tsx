import React from 'react';
import type { GithubRepo } from '../services/githubApi';

interface RepoCardProps {
  repo: GithubRepo;
}

const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-100 rounded-lg p-4 shadow hover:bg-blue-50 transition-colors flex items-center group cursor-pointer"
      title={repo.name}
    >
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-lg text-gray-800 truncate group-hover:text-blue-700">{repo.name}</div>
        <div className="text-gray-600 text-sm mb-1 truncate">{repo.description || 'No description'}</div>
      </div>
      <div className="flex items-center ml-4 flex-shrink-0">
        <span className="font-bold text-gray-700 mr-1">{repo.stargazers_count}</span>
        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
      </div>
    </a>
  );
};

export default RepoCard;
