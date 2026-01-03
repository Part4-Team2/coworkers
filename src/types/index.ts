export interface Todo {
  id: number;
  name: string;
  completedCount: number;
  totalCount: number;
  color: string;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  imageUrl?: string;
}

export interface TabItem {
  id: string;
  title: string;
  content: React.ReactNode;
}
