import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import { searchUsers as apiSearchUsers, getUserRepos } from '../services/githubApi';
import type { GithubUser, GithubRepo } from '../services/githubApi';

interface AppState {
  searchResults: GithubUser[];
  selectedUser: GithubUser | null;
  repos: GithubRepo[];
  loading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  searchUsers: (username: string) => Promise<void>;
  selectUser: (user: GithubUser) => Promise<void>;
  reset: () => void;
}

type Action =
  | { type: 'SEARCH_START' }
  | { type: 'SEARCH_SUCCESS'; payload: GithubUser[] }
  | { type: 'SEARCH_ERROR'; payload: string }
  | { type: 'SELECT_USER_START' }
  | { type: 'SELECT_USER_SUCCESS'; user: GithubUser; repos: GithubRepo[] }
  | { type: 'SELECT_USER_ERROR'; payload: string }
  | { type: 'RESET' };

const initialState: AppState = {
  searchResults: [],
  selectedUser: null,
  repos: [],
  loading: false,
  error: null,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SEARCH_START':
      return { ...state, loading: true, error: null };
    case 'SEARCH_SUCCESS':
      return { ...state, loading: false, searchResults: action.payload, error: null };
    case 'SEARCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SELECT_USER_START':
      return { ...state, loading: true, error: null, repos: [] };
    case 'SELECT_USER_SUCCESS':
      return { ...state, loading: false, selectedUser: action.user, repos: action.repos, error: null };
    case 'SELECT_USER_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const searchUsers = async (username: string) => {
    dispatch({ type: 'SEARCH_START' });
    try {
      const users = await apiSearchUsers(username);
      if (users.length === 0) {
        dispatch({ type: 'SEARCH_ERROR', payload: 'User not found' });
      } else {
        dispatch({ type: 'SEARCH_SUCCESS', payload: users });
      }
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = typeof e === 'object' && e && 'message' in e ? (e as any).message : 'Error searching users';
      dispatch({ type: 'SEARCH_ERROR', payload: message });
    }
  };

  const selectUser = async (user: GithubUser) => {
    dispatch({ type: 'SELECT_USER_START' });
    try {
      const repos = await getUserRepos(user.login);
      if (repos.length === 0) {
        dispatch({ type: 'SELECT_USER_ERROR', payload: 'No repositories found' });
      } else {
        dispatch({ type: 'SELECT_USER_SUCCESS', user, repos });
      }
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = typeof e === 'object' && e && 'message' in e ? (e as any).message : 'Error fetching repos';
      dispatch({ type: 'SELECT_USER_ERROR', payload: message });
    }
  };

  const reset = () => dispatch({ type: 'RESET' });

  return (
    <AppContext.Provider value={{ ...state, searchUsers, selectUser, reset }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
