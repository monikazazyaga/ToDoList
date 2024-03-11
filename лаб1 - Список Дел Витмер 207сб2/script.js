const myUL = document.querySelector('.myUL');
const myInput = document.querySelector('.myInput');
const addBtn = document.querySelector('.addBtn');
const cleanBtn = document.querySelector('.cleanBtn');
const filterLinks = document.querySelectorAll('.filter-link');
const completedCount = document.getElementById('completedCount');
const incompleteCount = document.getElementById('incompleteCount');
const totalCount = document.getElementById('totalCount');
const sortArrow = document.querySelector('.sort-arrow');
const sortOptions = document.querySelector('.sort-options');



// проверка наличия элементов в localStorage при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('tasks')) {
        myUL.innerHTML = localStorage.getItem('tasks');
    }

    updateTaskCount();
});

// Обновление localStorage 
function updateLocalStorage() {
    localStorage.setItem('tasks', myUL.innerHTML);
}

// Добавление нового элемента списка
function newElement() {
    if (myInput.value.trim() === '') {
        alert("Вы должны что-то написать!");
        return;
    }

    const li = document.createElement("li");
    const inputValue = myInput.value;
    const t = document.createTextNode(inputValue.trim());
    li.appendChild(t);

    const editBtn = document.createElement("span");
    editBtn.className = "edit";
    editBtn.textContent = " ✎"; 
    li.appendChild(editBtn);

    const currentDate = new Date().toLocaleDateString();
    const dateSpan = document.createElement("span");
    dateSpan.textContent = ` (${currentDate})`; 
    dateSpan.style.display = 'block';
    dateSpan.style.fontSize = '12px';
    dateSpan.style.marginLeft = '0px';
    li.appendChild(dateSpan);

    const closeBtn = document.createElement("span");
    closeBtn.className = "close";
    closeBtn.textContent = "\u00D7";
    li.appendChild(closeBtn);

    myUL.appendChild(li);
    myInput.value = "";

    updateTaskCount();
    updateLocalStorage();
    const whiteLine = document.querySelector('.white-line');
    const taskSummary = document.querySelector('.task-summary');
    whiteLine.classList.remove('inactive');
    taskSummary.classList.remove('inactive');
    checkTasks();
}



// Удаление всех элементов списка
function deleteAllElements() {
    myUL.innerHTML = "";
    updateTaskCount();
    updateLocalStorage();
}

// Подсчет количества элементов списка
function updateTaskCount() {
     const totalTasks = myUL.children.length;
    totalCount.querySelector('span').textContent = totalTasks;

    let completedTasks = 0;
    let incompleteTasks = 0;

    for (let i = 0; i < myUL.children.length; i++) {
        if (myUL.children[i].classList.contains('checked')) {
            completedTasks++;
        } else {
            incompleteTasks++;
        }
    }

    completedCount.querySelector('span').textContent = completedTasks;
    incompleteCount.querySelector('span').textContent = incompleteTasks;
    
    const whiteLine = document.querySelector('.white-line');
    const taskSummary = document.querySelector('.task-summary');
    whiteLine.classList.remove('inactive');
    taskSummary.classList.remove('inactive');
    checkTasks();
}

// Сортировка задач при клике на стрелку
function sortTasksBy(criteria) {
    const tasksList = Array.from(document.querySelectorAll('.myUL li'));
    
    tasksList.sort((a, b) => {
        if (criteria === 'newest') {
            return new Date(b.dataset.timestamp) - new Date(a.dataset.timestamp);
        } else if (criteria === 'oldest') {
            return new Date(a.dataset.timestamp) - new Date(b.dataset.timestamp);
        } else if (criteria === 'az') {
            return a.innerText.localeCompare(b.innerText);
        } else if (criteria === 'za') {
            return b.innerText.localeCompare(a.innerText);
        }
    });

    const myUL = document.querySelector('.myUL');
    myUL.innerHTML = '';
    tasksList.forEach(task => myUL.appendChild(task));
}

function filterTasks(status) {
    const tasks = document.querySelectorAll('.myUL li');

    tasks.forEach(task => {
        task.style.display = 'block'; // Показываем все дела
        if (status === 'completed' && !task.classList.contains('checked')) {
            task.style.display = 'none'; // Скрываем несделанные дела
        } else if (status === 'incomplete' && task.classList.contains('checked')) {
            task.style.display = 'none'; // Скрываем сделанные дела
        }
    });
}
// Обработчик для отметки элемента списка как выполненного и удаления элемента
myUL.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
        updateTaskCount();
        updateLocalStorage();
    } else if (ev.target.classList.contains('close')) {
        ev.target.parentElement.remove();
        updateTaskCount();
        updateLocalStorage();
    }
});

// Обработчик для фильтра
filterLinks.forEach(link => {
    link.addEventListener('click', function() {
        filterLinks.forEach(elem => elem.classList.remove('active'));
        this.classList.add('active');

        const filter = this.id;
        myUL.childNodes.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'block';
            } else if (filter === 'completed' && item.classList.contains('checked')) {
                item.style.display = 'block';
            } else if (filter === 'incomplete' && !item.classList.contains('checked')) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Обработчик для выбора сортировки
sortOptions.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'A') {
        const sortOption = ev.target.textContent;
        const allTasks = Array.from(myUL.children);
        
        if (sortOption === 'Самые новые') {
            allTasks.sort((a, b) => b.dataset.timestamp - a.dataset.timestamp);
        } else if (sortOption === 'Самые старые') {
            allTasks.sort((a, b) => a.dataset.timestamp - b.dataset.timestamp);
        } else if (sortOption === 'А-Я') {
            allTasks.sort((a, b) => a.textContent.localeCompare(b.textContent));
        } else if (sortOption === 'Я-А') {
            allTasks.sort((a, b) => b.textContent.localeCompare(a.textContent));
        }

        allTasks.forEach(task => myUL.appendChild(task));
    }
});


sortArrow.addEventListener('click', function() {
    sortOptions.style.display = sortOptions.style.display === 'none' ? 'block' : 'none';
});

function setActiveButton(buttonId) {
    const buttons = document.querySelectorAll('.count');
    buttons.forEach(button => {
        if (button.id === buttonId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function checkTasks() {
    const tasks = document.querySelectorAll('li');
    const whiteLine = document.querySelector('.white-line');
    const taskSummary = document.querySelector('.task-summary');
    const placeholder = document.querySelector('.placeholder');

    if (tasks.length === 0) {
        whiteLine.classList.add('inactive');
        taskSummary.classList.add('inactive');
        placeholder.classList.add('hidden');  
    } else {
        placeholder.classList.remove('hidden');  
    }
}
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit')&& !event.target.parentElement.classList.contains('checked')) {
        const listItem = event.target.parentNode;
        const taskText = listItem.firstChild.nodeValue.trim(); // Получаем текст задачи

                const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = taskText;
        editInput.className = 'edit-input';
        
                listItem.replaceChild(editInput, listItem.firstChild);
        
         editInput.focus();
        
        // сохранение изменений при нажатии Enter
        editInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const newTaskText = editInput.value.trim();
                if (newTaskText !== '') {
                    listItem.replaceChild(document.createTextNode(newTaskText), editInput);
                } else {
                    alert('Текст задачи не может быть пустым!');
                }
            }
        });
    } else if (event.target.classList.contains('edit') && event.target.parentElement.classList.contains('checked')) {
        alert('Нельзя редактировать выполненное дело!');
    }
});
checkTasks();