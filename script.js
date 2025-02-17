const model = {
    tasks: [

    ],

    addNote(title, text) {
      const id = new Date().getTime();

      const newNote = {id: id, title: title, text: text};
      this.tasks.push(newNote);
      view.renderTasks(model.tasks);
    },
};

const view = {
    init() {
      this.renderTasks(model.tasks);

      const form = document.querySelector('.form');
      const input = form.querySelector('.note-text');
      const textarea = form.querySelector('.note-description');

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = form.querySelector('.note-text').value;
        const text = form.querySelector('.note-description').value;
        controller.addNote(title, text);

        input.value = '';
        textarea.value = '';
      })
    },

    renderTasks(tasks) {
      const list = document.querySelector('.notes-list');

      let tasksHtml = '';

      for(let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        tasksHtml += `
        <li id='${task.id}' class="notes-list-item">
            <div class="note-header">
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
};

const controller = {
    addNote(title, text) {
      if(title, text) {
        model.addNote(title, text);
      }
    },
};

view.init();