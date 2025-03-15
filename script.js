const model = {
    tasks: [

    ],

    backgroundColor: 'yellow',

    addNote(title, text) {
      const id = new Date().getTime();
      const newNote = {id: id, title: title, text: text, color: this.backgroundColor, favorite: false};
      this.tasks.unshift(newNote);
    },

    toggleFavorite(id) {
      const note = this.tasks.find(note => note.id === id);
      if (note) {
          note.favorite = !note.favorite; // Toggle favorite status
      }
    },

    getFavoriteNotes() {
      return this.tasks.filter(note => note.favorite);
    },

    deleteNote(id) {
      this.tasks = this.tasks.filter(note => note.id !== id);
    },

    setColor(color) {
      this.backgroundColor = color;
    },

};

const view = {
    init() {
      this.renderTasks(model.tasks);
      controller.displayCountNotes(); //to ensure about notes count 0 on init

      const form = document.querySelector('.form');
      const input = form.querySelector('.note-text');
      const textarea = form.querySelector('.note-description');

      form.addEventListener('click', (event) => {
        event.preventDefault();
        if(event.target.classList.contains('submit-btn')) {
          const title = form.querySelector('.note-text').value;
          const text = form.querySelector('.note-description').value;
          controller.addNote(title, text, input, textarea);
          this.clearCheckedColors();
          document.querySelector('.list-item').classList.add('checked');
        }
      })

      const colorList = document.querySelector('.note-color-list');

      colorList.addEventListener('click', (event) => {
        event.preventDefault();
        if(event.target.tagName === "BUTTON") {
          this.clearCheckedColors();
          event.target.parentElement.classList.add('checked');
          const color = event.target.dataset.color;
          controller.addColor(color);
        }
      })

      const notesList = document.querySelector('.notes-list');

      notesList.addEventListener('click', (event) => {
        if(event.target.classList.contains('delete-button')) {
          const noteId = Number(event.target.closest('.notes-list-item').id);
          controller.deleteNote(noteId);
        }

        if(event.target.classList.contains('favorite-button')) {
          const noteId = Number(event.target.closest('.notes-list-item').id);
          controller.toggleFavorite(noteId);
        }
      })

      const favCheckbox = document.querySelector('#favorites');

      favCheckbox.addEventListener('change', (event) => {
        controller.toggleFavoritesFilter();;
      });

    },

    clearCheckedColors() {
      document.querySelectorAll('.list-item').forEach(item => item.classList.remove('checked'));
    },

    displayCountNotes(count) {
      const notesCount = document.querySelector('.notes-count');
      notesCount.textContent = count;
    },

    clearInputs(input, textarea) {
      input.value = '';
      textarea.value = '';
    },

    renderTasks(tasks, isFavoriteFilter = false) {
      const list = document.querySelector('.notes-list');
      const noMessageBlock = document.querySelector('.no-message-block');
      const noMessageText = noMessageBlock.querySelector('.no-notes-message');

      let tasksHtml = '';

      for(let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        tasksHtml += `
         <li id='${task.id}' class="notes-list-item">
            <div class="note-header ${task.color}">
              <p class="note-header-text">${task.title}</p>
              <div class="note-btns">
                <button type="button" class="favorite-button btn ${task.favorite ? 'active' : 'inactive'}"></button>
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

      if(tasks.length > 0) {
        noMessageBlock.style.display = 'none';
      } else {
        noMessageBlock.style.display = 'block';
        noMessageText.innerHTML = isFavoriteFilter ? `У вас нет ни одной избранной заметки` :
         `У вас нет еще ни одной заметки<br>
          Заполните поля выше и создайте свою первую заметку`;
      }
    },

    displayMessage(message, isError = false) {
      const messageBox = document.querySelector('.display-message');
      const displayMessage = document.querySelector('.display-text');

      displayMessage.textContent = message;
      if(isError) {
        messageBox.classList.remove('display-message-done');
        messageBox.classList.add('display-message-error')
      } else {
        messageBox.classList.remove('display-message-error');
        messageBox.classList.add('display-message-done');
      }

      messageBox.style.display = 'block';

      if(messageBox.dataset.timeoutId) {
        clearTimeout(messageBox.dataset.timeoutId);
      }

      const timeoutId = setTimeout(() => {
        messageBox.style.display = 'none';
        delete messageBox.dataset.timeoutId;
      }, 3000);

      messageBox.dataset.timeoutId = timeoutId;
    },
};

const controller = {
    showFavorites: false,  // Track if favorites checkbox is checked

    addNote(title, text, input, textarea) {
      if(title.length > 50) {
        view.displayMessage('Максимальная длина заголовка - 50 символов', true);
        this.addColor('yellow');
      } else if(title.trim() !== '' && text.trim() !== '') {
        view.clearInputs(input, textarea);
        view.displayMessage('Заметка добавлена!')
        model.addNote(title, text);
        this.filterFavorites();
        this.addColor('yellow');
      } else {
        view.displayMessage('Заполните все поля', true);
        this.addColor('yellow');
      }
    },

    toggleFavoritesFilter() {
      this.showFavorites = !this.showFavorites; // Toggle the filter state
      this.filterFavorites();  // Apply the filter after the state change
    },

    filterFavorites() {
      const tasks = this.showFavorites ? model.getFavoriteNotes() : model.tasks;
      view.renderTasks(tasks, this.showFavorites);
      this.displayCountNotes();
    },

    toggleFavorite(noteId) {
      model.toggleFavorite(noteId);  // Toggle the favorite status in the model
      this.filterFavorites();  // Re-render with the correct favorite filter
    },

    addColor(color) {
      model.setColor(color)
    },

    displayCountNotes() {
      let count = model.tasks.length;
      view.displayCountNotes(count);
    },

    deleteNote(id) {
      model.deleteNote(id);
      this.filterFavorites();
      view.displayMessage('Заметка удалена', true);
    },
};

view.init();