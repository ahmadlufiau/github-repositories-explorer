import { GITHUB_API_URL, GITHUB_TOKEN, GITHUB_API_VERSION } from '../lib/config';

export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  html_url: string;
}

function getGithubHeaders() {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': GITHUB_API_VERSION,
  };
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }
  return headers;
}

export async function searchUsers(username: string): Promise<GithubUser[]> {
  const res = await fetch(
    `${GITHUB_API_URL}/search/users?q=${encodeURIComponent(username)}&per_page=5`,
    { headers: getGithubHeaders() }
  );
  if (!res.ok) {
    throw new Error('Failed to search users');
  }
  const data = await res.json();
  return data.items as GithubUser[];
}

export async function getUserRepos(username: string): Promise<GithubRepo[]> {
  const res = await fetch(
    `${GITHUB_API_URL}/users/${encodeURIComponent(username)}/repos?sort=updated`,
    {
      headers: getGithubHeaders(),
    }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch user repos');
  }
  return (await res.json()) as GithubRepo[];
}
