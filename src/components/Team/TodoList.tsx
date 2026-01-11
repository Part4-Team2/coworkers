import TodoItem from "@/components/Team/TodoItem";
import { Todo } from "@/types/todo";

interface TodoListProps {
  todos: Todo[];
  onEdit?: (todoId: number) => void;
  onDelete?: (todoId: number) => void;
  onClick?: (todoId: number) => void;
}

export default function TodoList({
  todos,
  onEdit,
  onDelete,
  onClick,
}: TodoListProps) {
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
          onEdit={() => onEdit?.(todo.id)}
          onDelete={() => onDelete?.(todo.id)}
          onClick={() => onClick?.(todo.id)}
        />
      ))}
    </div>
  );
}
