import { Todo } from '../types';

export type FilterType = 'All' | 'Active' | 'Done';
export type SortType = 'MostRecent' | 'ID';

export type TodoState = {
  todos: Todo[];
  filter: FilterType;
  sortBy: SortType;
  isLoading: boolean;
  error: string | null;
};
