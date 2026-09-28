//测试性代码
const myImage = document.getElementById('test_img')

myImage.onclick = () => {
    const mySrc = myImage.getAttribute("src")
    if (mySrc === "/static/images/info_t.png") {
        myImage.setAttribute("src", "/static/images/grass_info.png")
    } else {
        myImage.setAttribute("src", "/static/images/info_t.png")
    }
};

let myButton = document.getElementById("changing_title")
let myHeading = document.getElementById("test-heading")

function setUserName() {
    const myName = prompt("Please enter your name.")
    if (!myName) {
        setUserName()
    }
    else {
        localStorage.setItem("name", myName)
        myHeading.textContent = `Welcome, ${myName}`
    }
}

if (!localStorage.getItem("name")) {
    setUserName()
} else {
    const storedName = localStorage.getItem("name")
    myHeading.textContent = `Welcome, ${storedName}`
}

myButton.onclick = () => {
    setUserName()
};

// 1. 计数器功能
const countElement = document.getElementById('count')
const increaseBtn = document.getElementById('increase')
const decreaseBtn = document.getElementById('decrease')
const resetBtn = document.getElementById('reset')

let count = 0;

increaseBtn?.addEventListener('click', () => {
    count++;
    updateCount();
});

decreaseBtn?.addEventListener('click', () => {
    count--;
    updateCount();
});

resetBtn?.addEventListener('click', () => {
    count = 0;
    updateCount();
});

function updateCount() {
    if (countElement) {
        countElement.textContent = count;
        countElement.style.color = count > 0 ? 'green' : count < 0 ? 'red' : 'black';
    }
}

// 2. 待办事项
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo');
const todoList = document.getElementById('todo-list');

addTodoBtn?.addEventListener('click', addTodo);
todoInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

function addTodo() {
    const text = todoInput.value.trim();
    if (text) {
        const li = document.createElement('li');
        li.innerHTML = `
      <span>${text}</span>
      <button class="delete-todo">删除</button>
    `;
        todoList.appendChild(li);
        todoInput.value = '';
    }
}

todoList?.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-todo')) {
        e.target.parentElement.remove();
    }
});

// 3. 模态框
const modal = document.getElementById('test-modal');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.querySelector('.close');

openModalBtn?.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeModalBtn?.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// 4. 标签页
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');

        // 移除所有active类
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // 添加active类
        button.classList.add('active');
        document.getElementById(tabId)?.classList.add('active');
    });
});

// 5. 折叠面板
const accordionButtons = document.querySelectorAll('.accordion-button');

accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        content.classList.toggle('active');
    });
});

// 6. API数据获取测试
const fetchBtn = document.getElementById('fetch-data');
const dataOutput = document.getElementById('data-output');

fetchBtn?.addEventListener('click', async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const data = await response.json();
        dataOutput.innerHTML = `
      <p><strong>标题:</strong> ${data.title}</p>
      <p><strong>内容:</strong> ${data.body}</p>
    `;
    } catch (error) {
        dataOutput.innerHTML = `<p style="color: red;">请求失败: ${error.message}</p>`;
    }
});

// 7. 动画控制
const toggleSpinBtn = document.getElementById('toggle-spin');
const spinner = document.querySelector('.spinner');

toggleSpinBtn?.addEventListener('click', () => {
    if (spinner.style.animationPlayState === 'paused') {
        spinner.style.animationPlayState = 'running';
        toggleSpinBtn.textContent = '暂停动画';
    } else {
        spinner.style.animationPlayState = 'paused';
        toggleSpinBtn.textContent = '播放动画';
    }
});