export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  created_at: string;
  updated_at: string;
};

export type FilterType = 'All' | 'Active' | 'Done';
export type SortType = 'MostRecent' | 'ID';
