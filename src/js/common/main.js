import '@/scss/style.scss';
import { TodoApp } from '../features';

new TodoApp();


handlePointerDown(e) {
    if (e.target.closest('button')) return;
    const id = this.getTodoIdFromElement(e.target);
    if (id === null) return;
    this.draggedId = id;
    this.startY = e.clientY;
  }

  handlePointerMove(e) {
    if (this.draggedId === null) return;
    if (!this.isDragging && this.shouldStartPointerDrag({ startY: this.startY, currentY: e.clientY })) {
      this.startPointerDrag(e);
    }
    if (!this.isDragging) return;
  }

  handlePointerUp(e) {
    try {
      if (!this.isDragging) return;
      if (this.draggedId === null) return;

      // ポインタの下にある本当の要素を取得
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;
      const target = this.getTodoItem(el);
      if (!target) return;
      const context = this.getPointerDropContext({el, clientY: e.clientY});
      if (!context) return;
      this.todos = this.reorderByDrop({ ...context, list: this.todos });
      this.saveAndRender();
    } finally {
      this.draggedId = null;
      this.isDragging = false;
    }
  }

  // * pointerでドラッグ判定したとき一度だけする処理
  startPointerDrag(e) {
    this.isDragging = true;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    // * ↑必須(やらないと途中でイベントが途切れる)
}

getPointerDropContext({el, clientY}) {
    const target = this.getTodoItem(el);
    if (target === null) return null;
    const toId = this.getTodoId(target);
    if (toId === null) return null;
    const fromId = this.draggedId;
    if (fromId === null) return null;
    const rect = target.getBoundingClientRect(); // 位置情報取得
    const middleY = rect.top + rect.height / 2; // 対象の真ん中のY座標取得
    const shouldInsertAfter = clientY > middleY; // 後ろに挿入すべきか?
    return { fromId, toId, shouldInsertAfter };
  }
