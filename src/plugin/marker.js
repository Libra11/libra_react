/*
 * @Author: Libra
 * @Date: 2023-12-12 09:50:38
 * @LastEditors: Libra
 * @Description: 
 */
import './marker.css';

export default class MarkerTool {
  static get isInline() {
    return true;
  }

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;
    this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
  }
  constructor({api}) {
    this.api = api;
    this.button = null;
    this._state = false;
    this.tag = 'INFO';
    this.class = 'cdx-marker';
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = '<svg width="20" height="18"><path d="M10.458 12.04l2.919 1.686-.781 1.417-.984-.03-.974 1.687H8.674l1.49-2.583-.508-.775.802-1.401zm.546-.952l3.624-6.327a1.597 1.597 0 0 1 2.182-.59 1.632 1.632 0 0 1 .615 2.201l-3.519 6.391-2.902-1.675zm-7.73 3.467h3.465a1.123 1.123 0 1 1 0 2.247H3.273a1.123 1.123 0 1 1 0-2.247z"/></svg>';
    this.button.classList.add(this.api.styles.inlineToolButton);

    return this.button;
  }

  static get sanitize() {
    return {
      info: {
        class: true,
        'data-word': true,
        'data-pronunciation': true,
        'data-example': true,
      },
    };
  }

  addHoverListeners(marker) {
    var tooltip = document.createElement('div');
    marker.addEventListener('mouseover', function() {
      tooltip.style.position = 'absolute';
      tooltip.style.backgroundColor = '#555';
      tooltip.style.color = 'white';
      tooltip.style.padding = '5px';
      tooltip.style.borderRadius = '5px';
      tooltip.style.zIndex = '999999';
      tooltip.textContent = '单词: ' + this.dataset.word + ', 音标: ' + this.dataset.pronunciation + ', 例句: ' + this.dataset.example;
      // 将这个新的元素添加到body中
      marker.appendChild(tooltip);

    });
    // 当鼠标移出.cdx-marker元素时，移除这个新的元素
    marker.addEventListener('mouseout', () => {
      marker.removeChild(tooltip);
    });
  }

  surround(range) {
    this.modal = this.createModal();
    document.body.appendChild(this.modal);
    this.modal.style.display = 'none';
    this.form = this.modal.querySelector('#my-form');
    this.submitButton = this.modal.querySelector('#submit');
    this.deleteButton = this.modal.querySelector('#delete');
    this.currentRange = null;
    this.addEventListeners();
    const modals = document.querySelectorAll('#my-modal');
    for (let i = 0; i < modals.length - 1; i++) {
      modals[i].parentNode.remove()
    }
    if (this.state) {
      this.unwrap(range);
      return;
    }

    this.wrap(range);
  }

  createModal() {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div id="my-modal" class="modal">
        <div class="modal-content">
          <span class="close">×</span>
          <form id="my-form">
            <label for="word">单词:</label><br>
            <input type="text" id="word" name="word"><br>
            <label for="pronunciation">音标:</label><br>
            <input type="text" id="pronunciation" name="pronunciation"><br>
            <label for="example">例句:</label><br>
            <input type="text" id="example" name="example"><br>
            <input type="button" value="保存" id="submit">
            <input type="button" value="删除" style="display: none;" id="delete">
          </form>
        </div>
      </div>
    `;
    return modal;
  }

  addEventListeners() {
    this.submitButton.addEventListener('click', this.handleSubmit.bind(this));
    this.deleteButton.addEventListener('click', this.handleDelete.bind(this));
    window.addEventListener('click', this.handleWindowClick.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();

    const dataElement = document.createElement(this.tag);
    dataElement.classList.add(this.class);
    dataElement.dataset.word = this.form.word.value;
    dataElement.dataset.pronunciation = this.form.pronunciation.value;
    dataElement.dataset.example = this.form.example.value;

    dataElement.appendChild(this.currentRange.extractContents());
    this.currentRange.insertNode(dataElement);
    this.addHoverListeners(dataElement);
    this.form.reset();
    this.modal.style.display = 'none';
  }

  handleDelete() {
    const text = this.currentRange.extractContents();
    const mark = this.api.selection.findParentTag(this.tag, this.class);
    mark.remove();
    this.currentRange.insertNode(text);
    this.deleteButton.style.display = 'none';
    this.modal.style.display = 'none';
  }

  handleWindowClick(event) {
    if (event.target == this.modal || event.target == this.modal.querySelector('.close')) {
      this.modal.style.display = 'none';
    }
  }

  wrap(range) {
    console.log('wrap', range, this.modal)
    this.currentRange = range;
    this.modal.style.display = 'block';
  }

  unwrap(range) {
    this.currentRange = range;
    this.deleteButton.style.display = 'block';
    const mark = this.api.selection.findParentTag(this.tag, this.class);
    this.modal.style.display = 'block';
    this.form.word.value = mark.dataset.word;
    this.form.pronunciation.value = mark.dataset.pronunciation;
    this.form.example.value = mark.dataset.example;
  }


  checkState() {
    const mark = this.api.selection.findParentTag(this.tag);

    this.state = !!mark;
  }
}