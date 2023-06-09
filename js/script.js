const input = document.getElementsByTagName('input'),
  tasksContainer = document.getElementsByClassName('tasks_container')[0],
  createTaskBtn = document.getElementsByClassName('create_task')[0],
  toggle = document.getElementsByClassName('toggle')[0],
  tasksCounter = document.getElementsByClassName('tasks_counter')[0],
  header = document.getElementsByTagName('header')[0],
  delete_all_btn = document.getElementsByClassName('delete_tasks_btn')[0],
  delete_task_btn = document.getElementsByClassName('task_delete_btn');

function addTask() {
  if (input[0].value && !input[0].value.startsWith(' ')) {
    const task = document.createElement('div');
    task.classList.add('task');
    tasksContainer.appendChild(task);
    task.dataset.id = input[0].value;

    localStorage.setItem(
      input[0].value,
      JSON.stringify({
        name: input[0].value,
        description: input[1].value,
        isChecked: false,
      })
    );

    task.insertAdjacentHTML(
      'afterbegin',
      `<div class="task_status">
      <label class="task_check">
              <input class="hidden-checkbox" type="checkbox" />
              <div class="checkbox">
                <i class="fas fa-check checkmark"></i>
              </div>
            </label>
            </div>
            <div class="task_info">
              <div class="task_name">
                <input class="task_input ${
                  localStorage.getItem('theme-mode') == 'dark'
                    ? 'dark-theme'
                    : ''
                }" type="text" readonly value='${input[0].value}'/>
              </div>
              <div class="task_description">
                <input class="task_input ${
                  localStorage.getItem('theme-mode') == 'dark'
                    ? 'dark-theme'
                    : ''
                }" type="text" readonly value='${input[1].value}'/>
              </div>
            </div>
            <div class="task_control">
              <button class="task_edit_btn">Edit</button>
              <i class="fa-solid fa-trash task_delete_btn ${
                localStorage.getItem('theme-mode') == 'dark'
                  ? 'dark-theme-font'
                  : ''
              }"></i>
            </div>`
    );

    input[0].value = '';
    input[1].value = '';
    getCountOfTasks();
  }
}

function deleteTask() {
  let target = event.target;
  if (target.classList.contains('task_delete_btn')) {
    localStorage.removeItem(target.offsetParent.dataset.id);
    tasksContainer.removeChild(target.offsetParent);
    getCountOfTasks();
  }
}

function editTask() {
  let target = event.target;
  const task_input = target.offsetParent.getElementsByClassName('task_input');
  if (
    target.classList.contains('task_edit_btn') &&
    target.innerText == 'Edit'
  ) {
    for (let i = 0; i < task_input.length; i++) {
      task_input[i].classList.add('active');
      task_input[i].removeAttribute('readonly');
    }
    target.innerText = 'Save';
  } else if (target.classList.contains('task_edit_btn')) {
    for (let i = 0; i < task_input.length; i++) {
      task_input[i].classList.remove('active');
      task_input[i].setAttribute('readonly', 'readonly');
    }
    localStorage.removeItem(target.offsetParent.dataset.id);
    target.offsetParent.dataset.id = task_input[0].value;

    localStorage.setItem(
      task_input[0].value,
      JSON.stringify({
        name: task_input[0].value,
        description: task_input[1].value,
        isChecked: target.offsetParent.classList.contains('checked')
          ? true
          : false,
      })
    );
    target.innerText = 'Edit';
  }
}
function setCheckedStatus() {
  let target = event.target;

  if (target.classList.contains('hidden-checkbox')) {
    const task_input = target.offsetParent.getElementsByClassName('task_input');
    const task_btns =
      target.offsetParent.getElementsByClassName('task_control')[0];

    target.offsetParent.classList.toggle('checked');

    localStorage.setItem(
      target.offsetParent.dataset.id,
      JSON.stringify({
        name: task_input[0].value,
        description: task_input[1].value,
        isChecked: target.checked ? true : false,
      })
    );

    for (let i = 0; i < task_input.length; i++) {
      if (task_input[i].classList.contains('active')) {
        task_input[i].classList.remove('active');
        task_input[i].setAttribute('readonly', 'readonly');
      }
      task_input[i].classList.toggle('checked');
      task_input[i].disabled = target.checked ? true : false;
    }

    task_btns.children[0].innerText = target.checked ? 'Done' : 'Edit';
    task_btns.children[0].disabled = target.checked ? true : false;
    task_btns.children[1].style = target.checked ? 'color: #fff' : '';
    task_btns.children[0].style = target.checked
      ? 'opacity: 0; pointer-events: none; '
      : 'opacity: 1';
    getCountOfTasks();
  }
}

function getCountOfTasks() {
  const doneTasks = [];

  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) != 'theme-mode') {
      if (
        JSON.parse(localStorage.getItem(localStorage.key(i))).isChecked == true
      ) {
        doneTasks.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
      }
    }
  }
  tasksCounter.innerHTML = `You have: ${
    localStorage.getItem('theme-mode') === null
      ? localStorage.length
      : localStorage.length - 1
  } tasks and <span class="done">${doneTasks.length} done</span> `;
}

function switchThemeMode() {
  document.body.classList.toggle('dark-theme');
  tasksCounter.classList.toggle('dark-theme-font');
  toggle.classList.toggle('dark-theme-font');
  header.classList.toggle('dark-theme-font');
  createTaskBtn.classList.toggle('dark-theme-font');

  for (let i = 0; i < input.length; i++) {
    input[i].classList.toggle('dark-theme');
  }
  for (let i = 0; i < delete_task_btn.length; i++) {
    delete_task_btn[i].classList.toggle('dark-theme-font');
  }

  if (document.body.classList.contains('dark-theme')) {
    localStorage.setItem('theme-mode', 'dark');
    toggle.textContent = 'light_mode';
  } else {
    localStorage.setItem('theme-mode', 'light');
    toggle.textContent = 'dark_mode';
  }
}

delete_all_btn.addEventListener('click', () => {
  if (
    localStorage.getItem('theme-mode') == 'light' ||
    localStorage.getItem('theme-mode') === null
  ) {
    localStorage.clear();
  } else {
    localStorage.clear();
    localStorage.setItem('theme-mode', 'dark');
  }

  tasksContainer.innerHTML = '';
  getCountOfTasks();
});

window.onload = function getStorageTasks() {
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) != 'theme-mode') {
      const task = document.createElement('div');

      task.classList.add('task');
      tasksContainer.appendChild(task);
      task.dataset.id = JSON.parse(
        localStorage.getItem(localStorage.key(i))
      ).name;

      JSON.parse(localStorage.getItem(task.dataset.id)).isChecked
        ? task.classList.add('checked')
        : null;

      task.insertAdjacentHTML(
        'afterbegin',
        ` <div class="task_status">
              <label class="task_check">
                <input class="hidden-checkbox" type="checkbox"  ${
                  JSON.parse(localStorage.getItem(task.dataset.id)).isChecked
                    ? 'checked'
                    : null
                } />
                <div class="checkbox">
                  <i class="fas fa-check checkmark"></i>
                </div>
              </label>
            </div>
            <div class="task_info">
              <div class="task_name">
                <input class="task_input ${
                  JSON.parse(localStorage.getItem(task.dataset.id)).isChecked
                    ? 'checked'
                    : ''
                }" type="text" readonly value='${
          JSON.parse(localStorage.getItem(task.dataset.id)).name
        }'/>
              </div>
              <div class="task_description ">
                <input class="task_input ${
                  JSON.parse(localStorage.getItem(task.dataset.id)).isChecked
                    ? 'checked'
                    : ''
                }" type="text" readonly value='${
          JSON.parse(localStorage.getItem(task.dataset.id)).description
        }'/>
              </div>
            </div>
            <div class="task_control">
              <button class="task_edit_btn" ${
                JSON.parse(localStorage.getItem(task.dataset.id)).isChecked
                  ? 'disabled'
                  : null
              } style="${
          JSON.parse(localStorage.getItem(task.dataset.id)).isChecked
            ? 'opacity: 0; pointer-events: none;'
            : 'opacity: 1'
        }">${
          JSON.parse(localStorage.getItem(task.dataset.id)).isChecked
            ? 'Done'
            : 'Edit'
        }</button>
              <i class="fa-solid fa-trash task_delete_btn" style="${
                JSON.parse(localStorage.getItem(task.dataset.id)).isChecked
                  ? 'color: #fff'
                  : ''
              }"></i>
            </div>`
      );
    }
  }
  if (localStorage.getItem('theme-mode') == 'dark') {
    toggle.textContent = 'light_mode';
    document.body.classList.add('dark-theme');
    tasksCounter.classList.add('dark-theme-font');
    toggle.classList.add('dark-theme-font');
    header.classList.add('dark-theme-font');
    createTaskBtn.classList.add('dark-theme-font');

    for (let i = 0; i < input.length; i++) {
      input[i].classList.add('dark-theme');
    }
    for (let i = 0; i < delete_task_btn.length; i++) {
      delete_task_btn[i].classList.add('dark-theme-font');
    }
  }
  getCountOfTasks();
};

createTaskBtn.addEventListener('click', addTask);
tasksContainer.addEventListener('click', editTask);
tasksContainer.addEventListener('click', deleteTask);
tasksContainer.addEventListener('click', setCheckedStatus);
toggle.addEventListener('click', switchThemeMode);
