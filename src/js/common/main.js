import '@/scss/style.scss';
import { TodoApp } from '../features';

new TodoApp();

// moveTodoById({ list, id, offset }) {
//   const index = list.findIndex(todo => todo.id === id);
//   if (index === -1) return list;

//   const newIndex = index + offset;
//   if (newIndex < 0 || newIndex >= list.length) return list;

//   const newList = [...list];
//   const [item] = newList.splice(index, 1);
//   newList.splice(newIndex, 0, item);

//   return newList;
// }

// handleMoveUp(button) {
//   const id = this.getTodoIdFromElement(button);
//   if (id === null) return;

//   this.todos = this.moveTodoById({
//     list: this.todos,
//     id,
//     offset: -1
//   });

//   this.saveAndRender();
// }

