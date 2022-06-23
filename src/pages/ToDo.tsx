import { ChangeEvent, useState } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

type TodoItem = {
  id: number;
  text: string;
  isComplete: boolean;
};

const todoListState = atom<TodoItem[]>({
  key: 'TodoList',
  default: [],
});

export function ToDoList() {
  const todoList = useRecoilValue(todoListState);

  return (
    <>
      <TodoItemCreator />
    </>
  );
}

function TodoItemCreator() {
  const [ inputValue, setInputValue ] = useState('');
  const setTodoList = useSetRecoilState(todoListState);

  const addItem = () => {
    setTodoList((oldTodoList) => [
      ...oldTodoList,
      {
        id: getId(),
        text: inputValue,
        isComplete: false,
      }
    ]);

    setInputValue('');
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={onChange}
      />
    </div>
  );
}

let id = 0;
function getId() {
  return id++;
}
