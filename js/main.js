//cautare elemente
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = []; //tabel in care inscrim task-uri in forma de obiecte si pastrat in Local Storage

if (localStorage.getItem("tasks")) {
  // Daca sunt elem in LStorage le incarca in array tasks
  tasks = JSON.parse(localStorage.getItem("tasks"));
  //Adaugare elemente din array tasks (din storage) in document
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();
//add task
form.addEventListener("submit", addTask);

//delete task
tasksList.addEventListener("click", deleteTask);

//Done task
tasksList.addEventListener("click", doneTask);

function addTask(event) {
  //submit - cind se trimite forma
  event.preventDefault(); // cancel reload page by default
  const taskText = taskInput.value; //Valoarea textului din Input
  // Descriere task in forma de obiect
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };
  tasks.push(newTask); //inscriere in tabel a obiectului task
  saveToLocalStorage();

  renderTask(newTask);
  // curatire cimp introducere
  taskInput.value = "";
  // focus peste input
  taskInput.focus();
  checkEmptyList();
}

function deleteTask(event) {
  if (event.target.dataset.action !== "delete") return;
  const parentNode = event.target.closest(".list-group-item"); // metoda closest peremite a cauta in exterior cel mai apropiat element
  //Determinare ID task
  const id = Number(parentNode.id);
  const index = tasks.findIndex((task) => task.id === id); // in findIndex ca argument e  o functie care: return true daca id element -
  //array tasks coincide cu parent id care trebuie delete
  tasks.splice(index, 1);
  //!Metoda .filter!Exemplu
  //tasks = tasks.filter((task) => task.id !== id); // if task.id !== id then valoare true si  trece in array nou format de method .filter
  //Stergem din array tasks deleted task
  parentNode.remove();
  saveToLocalStorage();
  //Verifica nr. de elemente in tree. if = 1 => apare blocul No Tasks
  checkEmptyList();
}

function doneTask(event) {
  if (event.target.dataset.action !== "done") return;
  const parentNode = event.target.closest(".list-group-item"); //.closest permite a cauta in exterior cel mai apropiat element
  const taskTitle = parentNode.querySelector(".task-title");
  const id = Number(parentNode.id);
  // const task = tasks.find(function (task) {
  //   if (task.id === id) {
  //     return true;
  //   }
  // });
  // varianta prescurtata mai jos
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done; // task.done din obiect e boolean. In cazul isi inverseaza valoarea
  saveToLocalStorage();
  taskTitle.classList.toggle("task-title--done"); // .toggle sterge class vechi si adauga pe cel nou
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
                                <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                                <div class="empty-list__title">Список дел пуст</div>
                            </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }
  if (tasks.length > 0) {
    const emptyListElement = document.querySelector("#emptyList");
    emptyListElement ? emptyListElement.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks)); //!!!!!!De aflat mai mult despre JSON.stringify si JSON.parse
}

function renderTask(task) {
  const cssClass = task.done ? "task-title task-title--done" : "task-title"; // in dependenta de boolean task.done variabila cssClass
  const taskHTML = `
                    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                      <span class="${cssClass}">${task.text}</span>
                      <div class="task-item__buttons">
                          <button type="button" data-action="done" class="btn-action">
                              <img src="./img/tick.svg" alt="Done" width="18" height="18">
                          </button>
                          <button type="button" data-action="delete" class="btn-action">
                              <img src="./img/cross.svg" alt="Done" width="18" height="18">
                          </button>
                      </div>
                      </li>`;
  //Adaugam li in ul. metoda permite de a introduce un segement ca cod HTML
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
