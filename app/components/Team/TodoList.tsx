import TodoItem from "@/app/components/Team/TodoItem";
import { Todo } from "@/app/types";

interface TodoListProps {
  todos: Todo[];
  onMenuClick?: (todoId: number) => void;
}

export default function TodoList({ todos, onMenuClick }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center pt-48 lg:pt-64 text-text-default text-md font-medium">
        아직 할 일 목록이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10" role="list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          name={todo.name}
          completedCount={todo.completedCount}
          totalCount={todo.totalCount}
          color={todo.color}
          onMenuClick={() => onMenuClick?.(todo.id)}
        />
      ))}
    </div>
  );
}
