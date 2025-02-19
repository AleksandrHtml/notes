const model = {
    tasks: [

    ],

    backgroundColor: 'yellow',

    addNote(title, text) {
      const id = new Date().getTime();
      const newNote = {id: id, title: title, text: text, color: this.backgroundColor};
      this.tasks.push(newNote);
      view.renderTasks(model.tasks);
    },

    setColor(color) {
      this.backgroundColor = color;
    }
};

const view = {
    init() {
      this.renderTasks(model.tasks);

      const form = document.querySelector('.form');
      const input = form.querySelector('.note-text');
      const textarea = form.querySelector('.note-description');

      form.addEventListener('click', (event) => {
        event.preventDefault();
        if(event.target.classList.contains('submit-btn')) {
          const title = form.querySelector('.note-text').value;
          const text = form.querySelector('.note-description').value;
          controller.addNote(title, text, input, textarea);
        }
      })

      const colorList = document.querySelector('.note-color-list');

      colorList.addEventListener('click', (event) => {
        event.preventDefault();
        if(event.target.tagName === "BUTTON") {
          document.querySelectorAll('.list-item').forEach(item => item.classList.remove('checked'));
          event.target.parentElement.classList.add('checked');
        }
        const color = event.target.dataset.color;
        controller.addColor(color);
      })
    },

    clearInputs(input, textarea) {
      input.value = '';
      textarea.value = '';
    },

    renderTasks(tasks) {
      const list = document.querySelector('.notes-list');

      let tasksHtml = '';

      for(let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        tasksHtml += `
        <li id='${task.id}' class="notes-list-item">
            <div class="note-header ${task.color}">
              <p class="note-header-text">${task.title}</p>
              <div class="note-btns">
                <button type="button" class="favorite-button btn"></button>
                <button type="button" class="delete-button btn"></button>
              </div>
            </div>
            <div class="card-text-block">
              <p class="card-text">
                ${task.text}
              </p>
            </div>
          </li>
          `;
      }
      list.innerHTML = tasksHtml;
    },

    displayMessage(message, isError = false) {
      const messageBox = document.querySelector('.display-message');
      messageBox.textContent = message;
      if(isError) {
        messageBox.classList.remove('display-message-done');
        messageBox.classList.add('display-message-error')
      } else {
        messageBox.classList.remove('display-message-error');
        messageBox.classList.add('display-message-done');
      }

      messageBox.style.display = 'block';

      setTimeout(() => {
        messageBox.style.display = 'none';
      }, 3000)
    },
};

const controller = {
    addNote(title, text, input, textarea) {
      if(title.length > 10) {
        view.displayMessage('Максимальная длина заголовка - 50 символов', true)
      } else if(title.trim() !== '' && text.trim() !== '') {
        view.clearInputs(input, textarea);
        view.displayMessage('Заметка добавлена!')
        model.addNote(title, text);
      } else {
        view.displayMessage('Заполните все поля', true)
      }
    },

    addColor(color) {
      model.setColor(color)
    },
};

view.init();