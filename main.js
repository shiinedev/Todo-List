const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");


// loaded tasks from local storge

const loadTasks = () => {
    const tasks = getTaskFromLocalStorage();
    tasks.forEach(task => {
        addTaskToDom(task);
    })
}

//add event to the dom 

document.addEventListener("DOMContentLoaded", loadTasks);


//add task
const addTask = (e) => {
    e.preventDefault();

    const taskText = todoInput.value.trim();
    if( taskText !== ""){
       const task = {
        id: Date.now(),
        text:taskText,
        completed: false
       }

       addTaskToDom(task);
       saveTaskToLocalStorage(task);
       todoInput.value = "";
    }
    
}
//add event to the form 

todoForm.addEventListener("submit", addTask);

// add task to the Dom

const addTaskToDom = (task) => {

    const li = document.createElement("li");
    li.className = `todo-item  ${task.completed ? "completed" : ""}`;
    li.dataset.id = task.id;

    li.innerHTML = `
            <input type="checkbox" class="isCompelete" ${task.completed ? "checked" : ""}>
            <span class="text">${task.text}</span>
            <button class="edit-btn">Edit</buttn>
            <button class="delete-btn"> Delete</buttn>`
    todoList.appendChild(li);

    attachHandleListeners(task, li);
}

// attach handle listeners 

const attachHandleListeners = (task , li) => {
    const deleteBtn = li.querySelector(".delete-btn");
    const editBtn = li.querySelector(".edit-btn");
    const checkbox = li.querySelector(".isCompelete");

    deleteBtn.addEventListener("click", () =>{

        handleDelete(task.id , li);
    })

    editBtn.addEventListener("click" , () => {

        handleEdit(task.id, li);
        
    });

    checkbox.addEventListener("change" , () => {

        toggleTaskCompletion(task.id, li , checkbox.checked)
    })
}

//handle edit 

const handleEdit = (id, li) => {
 
    const taskText = li.querySelector(".text");

    //updated the dom  in real time
    const newText = prompt("update the text : " , taskText.textContent);
    taskText.textContent = newText;

    //update the local Storage
    updateTask(id,newText);
 
}

//update task

const updateTask = (id, newText) => {
    const tasks = getTaskFromLocalStorage();
    const task = tasks.find(task => task.id == id);

    if(task !== null && task.trim !== ""){
        task.text = newText;
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }
}

// toogle task completion
const toggleTaskCompletion = (id, li,isComplete) => {
    const tasks = getTaskFromLocalStorage();

    const task = tasks.find(task => task.id == id);

    if(task){
        task.completed = isComplete;
        localStorage.setItem("tasks" , JSON.stringify(tasks));
        li.classList.toggle("completed", isComplete);
    }
}
//delete tasks

const handleDelete = (id,li) => {

    let tasks = getTaskFromLocalStorage();

   tasks = tasks.filter(task => task.id != id);

   localStorage.setItem("tasks", JSON.stringify(tasks));

   li.remove();
    
}

//save task  to local storage
const saveTaskToLocalStorage = (task) =>{
    const oldaTask = getTaskFromLocalStorage();

    oldaTask.push(task);

    localStorage.setItem("tasks" , JSON.stringify(oldaTask));
    
}

// get tesk From local storage
const getTaskFromLocalStorage = () => {
    const oldaTask = JSON.parse(localStorage.getItem("tasks")) || [];
    return oldaTask;
}