export default class TodoApp {
  constructor() {
    // ==========================================
    // state
    // ==========================================
    this.todos = JSON.parse(localStorage.getItem('todos')) || []; // localStorage読み込み
    this.draggedId = null;

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
    this.handleAddTodo = this.handleAddTodo.bind(this);
    this.handleIncompleteListClick = this.handleIncompleteListClick.bind(this);
    this.handleCompleteListClick = this.handleCompleteListClick.bind(this);
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDrop = this.handleDrop.bind(this);

    // ==========================================
    // init
    // ==========================================
    this.handleEvent();
    this.renderTodos();
  }

  // ==========================================
  // ロジック
  // ==========================================
  // *
  /**
   * ドラッグ移動時の挿入位置(戻り値: insertIndex)を計算する
   * fromIndex, toIndexで移動方向と、shouldInsertAfterの
   * マウスが閾値を超えたかどうかを元に挿入すべきindexを返す
   */
  calculateInsertIndex({ fromIndex, toIndex, shouldInsertAfter }) {
    const isMovingDown = fromIndex < toIndex;
    if (isMovingDown) {
      return shouldInsertAfter ? toIndex : toIndex - 1;
    } else {
      return shouldInsertAfter ? toIndex + 1 : toIndex;
    }
  }

  // ==========================================
  // state操作
  // ==========================================

  // * 新しいtodoをtodosに追加する
  addTodo(text) {
    this.todos.unshift({
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

  // * todosの並び順を変更する
  moveTodos({ fromIndex, toIndex }) {
    const list = [...this.todos];
    const [item] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, item);
    this.todos = list;
  }

  // * 指定されたtodoを一つ上に移動させる
  moveTodoUp(index) {
    if (index === 0) return; // 1番上なら何もしない
    this.moveTodos({ fromIndex: index, toIndex: index - 1 });
  }

  // * 指定されたtodoを一つ下に移動させる
  moveTodoDown(index) {
    if (index === this.todos.length - 1) return; // 1番下なら何もしない
    this.moveTodos({ fromIndex: index, toIndex: index + 1 });
  }

  // * 保存と描画を同じに実行する
  saveAndRender() {
    this.saveTodos();
    this.renderTodos();
  }

  // ==========================================
  // DOM取得
  // ==========================================

  // * buttonを元にtodosのindexを取得する関数
  getTodoIndexFromElement(element) {
    const todoItem = element.closest('.todo__item'); // 見つからない時はnullを返す
    if (!todoItem) return -1;
    const id = Number(todoItem.dataset.id);
    if (Number.isNaN(id)) return -1;
    return this.todos.findIndex((todo) => todo.id === id);
    // ? 一致しない時は-1を返す。ので上のif文でも見つからなかった時は戻り値を-1で統一する
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
    this.addButton.addEventListener('click', this.handleAddTodo, false);
    this.incompleteList.addEventListener('click', this.handleIncompleteListClick, false);
    this.completeList.addEventListener('click', this.handleCompleteListClick, false);
    this.incompleteList.addEventListener('dragstart', this.handleDragStart, false);
    this.incompleteList.addEventListener('dragover', this.handleDragOver, false);
    this.incompleteList.addEventListener('drop', this.handleDrop, false);
  }

  // * todo 追加処理
  handleAddTodo() {
    const text = this.input.value;
    if (text.trim() === '') return; // 空文字なら無視
    this.addTodo(text);
    this.saveAndRender();
    this.input.value = '';
  }

  // * Enterでもtodo追加(e.isComposingは、日本語変換中のenter時にtrueになる。)
  handleInputKeyDown(e) {
    if (e.key === 'Enter' && !e.isComposing) {
      this.handleAddTodo();
    }
  }

  // * deleteボタン押した処理
  handleDeleteItem(button) {
    const index = this.getTodoIndexFromElement(button);
    if (index === -1) return; // -1 は、findIndexして見つからなかったときに取得する値
    this.deleteTodo(index);
    this.saveAndRender();
  }

  // * completeボタン押した処理
  handleCompleteItem(button) {
    const index = this.getTodoIndexFromElement(button);
    if (index === -1) return;
    this.updateStatus(index, 'complete');
    this.saveAndRender();
  }

  // * backボタンを押した処理
  handleBackItem(button) {
    const index = this.getTodoIndexFromElement(button);
    if (index === -1) return;
    this.updateStatus(index, 'incomplete');
    this.saveAndRender();
  }

  // * ↑ボタンを押した時の処理
  handleMoveUp(button) {
    const index = this.getTodoIndexFromElement(button);
    if (index === -1) return;
    this.moveTodoUp(index);
    this.saveAndRender();
  }

  // * ↓ボタンを押した時の処理
  handleMoveDown(button) {
    const index = this.getTodoIndexFromElement(button);
    if (index === -1) return;
    this.moveTodoDown(index);
    this.saveAndRender();
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

  // * ドラッグ開始処理
  handleDragStart(e) {
    const item = e.target.closest('.todo__item');
    if (!item) return;
    const id = Number(item.dataset.id);
    if (Number.isNaN(id)) return;
    this.draggedId = id;
  }

  // * ドラッグ中
  handleDragOver(e) {
    e.preventDefault();
  }

  // * ドロップ処理(離したとき)
  handleDrop(e) {
    e.preventDefault();
    try {
      const target = e.target.closest('.todo__item');
      if (!target) return; // .todo__itemを“保証する”ためのガード」

      const toIndex = this.getTodoIndexFromElement(target);
      if (toIndex === -1) return;

      const id = this.draggedId;
      if (id === null) return;

      const fromIndex = this.todos.findIndex((todo) => todo.id === id);
      if (fromIndex === -1) return;

      const rect = target.getBoundingClientRect(); // 位置情報取得
      const middleY = rect.top + rect.height / 2; // 対象の真ん中のY座標取得
      const shouldInsertAfter = e.clientY > middleY; // 後ろに挿入すべきか?

      const insertIndex = this.calculateInsertIndex({ fromIndex, toIndex, shouldInsertAfter });

      if (fromIndex === insertIndex) return;

      this.moveTodos({ fromIndex, toIndex: insertIndex });
      this.saveAndRender();
    } finally {
      this.draggedId = null; // これだけは、早期returnでもしときたいのでfinallyに書いておく
    }
  }


}


// todo pointerイベントで

// todo 編集機能

// todo データ配列にunshiftすることで、新しい追加todoは前に表示することになったけど、
// todo 戻すや完了を押したときにtodoは後に追加する形になっているのどうにかできないかな？
