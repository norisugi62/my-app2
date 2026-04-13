export default class TodoApp {
  constructor() {
    // ==========================================
    // state
    // ==========================================
    this.todos = JSON.parse(localStorage.getItem('todos')) || []; // localStorage読み込み

    // ==========================================
    // DOM
    // ==========================================
    this.input = document.getElementById('todo__input-text');
    this.addButton = document.getElementById('todo__add-button');
    this.incompleteList = document.getElementById('todo__incomplete-list');
    this.completeList = document.getElementById('todo__complete-list');

    // ==========================================
    // bind
    // ==========================================
    this.onClickAdd = this.onClickAdd.bind(this);
    this.handleIncompleteListClick = this.handleIncompleteListClick.bind(this);
    this.handleCompleteListClick = this.handleCompleteListClick.bind(this);
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);

    // ==========================================
    // init
    // ==========================================
    this.handleEvent();
    this.renderTodos();
  }

  // ==========================================
  // state操作
  // ==========================================

  // * 新しいtodoをtodosに追加する
  addTodo(text) {
    this.todos.push({
      text,
      status: 'incomplete',
      id: Date.now(),
    });
  }

  // * 指定したindexにあるtodoを削除
  deleteTodo(index) {
    this.todos.splice(index, 1);
  }

  // * 指定したindexにあるtodoのstatusを変更する
  updateStatus(index, status) {
    this.todos[index].status = status;
  }

  // * 現在のtodosをローカルストレージに保存
  saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  // * 指定されたtodoを一つ上に移動させる
  moveTodoUp(index) {
    // 1番上なら何もしない
    if (index === 0) return;
    // 要素を取り出す
    const [item] = this.todos.splice(index, 1);
    // 取り出した要素を一つ上にずらす
    this.todos.splice(index - 1, 0, item);
  }

  // * 指定されたtodoを一つ下に移動させる
  moveTodoDown(index) {
    // 1番下なら何もしない
    if (index === this.todos.length - 1) return;
    // 要素を取り出す
    const [item] = this.todos.splice(index, 1);
    // 取り出した要素を１つ下にずらす
    this.todos.splice(index + 1, 0, item);
  }

  // ==========================================
  // DOM取得
  // ==========================================

  // * buttonを元にtodosのindexを取得する関数
  getTodoIndexFromButton(button) {
    const todoItem = button.closest('.todo__item');
    const id = Number(todoItem.dataset.id);
    return this.todos.findIndex((todo) => todo.id === id);
  }

  // * templateタグからcloneを作り出し取得
  createCloneFromTemplate(templateId) {
    const template = document.getElementById(templateId);
    return template.content.cloneNode(true);
  }

  // ==========================================
  // 描画
  // ==========================================

  // * 読み込んだtodoを描画
  renderTodos() {
    // 一旦空にする
    this.incompleteList.innerHTML = '';
    this.completeList.innerHTML = '';

    this.todos.forEach((todo) => {
      const element = this.createTodoElement(todo); // 描画するtodoを取得
      const list = this.getTargetList(todo.status); // 描画するリストを取得
      list.append(element); // リストに要素を追加していく
    });
  }

  // * 描画するtodoを返す
  createTodoElement(todo) {
    const isIncomplete = todo.status === 'incomplete';
    const templateId = isIncomplete ? 'todo__incomplete-template' : 'todo__complete-template';
    const templateClone = this.createCloneFromTemplate(templateId);
    templateClone.querySelector('.todo__item-text').textContent = todo.text;
    templateClone.querySelector('.todo__item').dataset.id = todo.id;
    return templateClone;
  }

  // * 描画するリストを取得
  getTargetList(status) {
    return status === 'incomplete' ? this.incompleteList : this.completeList;
  }

  // ==========================================
  // イベント
  // ==========================================

  // * イベント登録
  handleEvent() {
    this.input.addEventListener('keydown', this.handleInputKeyDown, false);
    this.addButton.addEventListener('click', this.onClickAdd, false);
    this.incompleteList.addEventListener('click', this.handleIncompleteListClick, false);
    this.completeList.addEventListener('click', this.handleCompleteListClick, false);
  }

  // * todo 追加処理
  onClickAdd() {
    const text = this.input.value;
    if (text.trim() === '') return; // 空文字なら無視
    this.addTodo(text);
    this.saveTodos();
    this.renderTodos();
    this.input.value = '';
  }

  // * Enterでもtodo追加(e.isComposingは、日本語変換中のenter時にtrueになる。)
  handleInputKeyDown(e) {
    if (e.key === 'Enter' && !e.isComposing) {
      this.onClickAdd();
    }
  }

  // * deleteボタン押した処理
  handleDeleteItem(button) {
    const index = this.getTodoIndexFromButton(button);
    if (index === -1) return; // -1 は、findIndexして見つからなかったときに取得する値
    this.deleteTodo(index);
    this.saveTodos();
    this.renderTodos();
  }

  // * completeボタン押した処理
  handleCompleteItem(button) {
    const index = this.getTodoIndexFromButton(button);
    if (index === -1) return;
    this.updateStatus(index, 'complete');
    this.saveTodos();
    this.renderTodos();
  }

  // * backボタンを押した処理
  handleBackItem(button) {
    const index = this.getTodoIndexFromButton(button);
    if (index === -1) return;
    this.updateStatus(index, 'incomplete');
    this.saveTodos();
    this.renderTodos();
  }

  // * ↑ボタンを押した時の処理
  handleMoveUp(button) {
    const index = this.getTodoIndexFromButton(button);
    if (index === -1) return;
    this.moveTodoUp(index);
    this.saveTodos();
    this.renderTodos();
  }

  // * ↓ボタンを押した時の処理
  handleMoveDown(button) {
    const index = this.getTodoIndexFromButton(button);
    if (index === -1) return;
    this.moveTodoDown(index);
    this.saveTodos();
    this.renderTodos();
  }

  // * 未完了TODOの中の処理
  handleIncompleteListClick(e) {
    const deleteBtn = e.target.closest('.todo__delete-button');
    const completeBtn = e.target.closest('.todo__complete-button');
    const upBtn = e.target.closest('.todo__up-button');
    const downBtn = e.target.closest('.todo__down-button');

    // 上ボタン
    if (upBtn) {
      this.handleMoveUp(upBtn);
      return;
    }

    //下ボタン
    if (downBtn) {
      this.handleMoveDown(downBtn);
      return;
    }

    // 削除
    if (deleteBtn) {
      this.handleDeleteItem(deleteBtn);
      return;
    }

    // 完了
    if (completeBtn) {
      this.handleCompleteItem(completeBtn);
      return;
    }
  }

  // * 完了TODOの中の処理
  handleCompleteListClick(e) {
    const backBtn = e.target.closest('.todo__back-button');
    const upBtn = e.target.closest('.todo__up-button');
    const downBtn = e.target.closest('.todo__down-button');

    // 上ボタン
    if (upBtn) {
      this.handleMoveUp(upBtn);
      return;
    }

    //下ボタン
    if (downBtn) {
      this.handleMoveDown(downBtn);
      return;
    }

    // 戻る
    if (backBtn) {
      this.handleBackItem(backBtn);
      return;
    }
  }
}


// todo ドラッグで並び順変更
// todo 編集機能
