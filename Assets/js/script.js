// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  if (!nextId) { // If there's no nextId stored, start from 1
      nextId = 1;
  } else {
      nextId++; // Increment nextId to ensure the next ID is unique
  }
  localStorage.setItem("nextId", JSON.stringify(nextId)); // Store the updated nextId back to localStorage
  return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  //Main card element
  const card = document.createElement('div');
card.setAttribute('data-task-id', task.id);
 card.className = 'card';
  // Card body
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  // Title element
  const title = document.createElement('h5');
  title.className = 'card-title';
  title.textContent = task.title;

  // Description element
  const description = document.createElement('p');
  description.className = 'card-text';
  description.textContent = task.description;

  // Delete button
  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn btn-danger btn-sm';
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = function () {
      // Functionality to delete this task
      handleDeleteTask(task.id);
  };

  // Append elements to the card body
  cardBody.appendChild(title);
  cardBody.appendChild(description);
  cardBody.appendChild(deleteButton);

  // Append the card body to the main card element
  card.appendChild(cardBody);

  return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // Clear existing tasks
  document.getElementById('todo-cards').innerHTML = '';
  document.getElementById('in-progress-cards').innerHTML = '';
  document.getElementById('done-cards').innerHTML = '';

  // Assuming tasks are stored in an array 'taskList'
  taskList.forEach(task => {
      const taskCard = createTaskCard(task);
      // Append the card to the corresponding column based on task status
      switch (task.status) {
          case 'to-do':
              document.getElementById('todo-cards').appendChild(taskCard);
              break;
          case 'in-progress':
              document.getElementById('in-progress-cards').appendChild(taskCard);
              break;
          case 'done':
              document.getElementById('done-cards').appendChild(taskCard);
              break;
      }
  });

  // Make the cards draggable using jQuery UI
  $(".card").draggable({
      containment: 'document',
      revert: true, // This will make the card go back to its original position unless it is properly dropped.
      start: function (event, ui) {
      }
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault(); // Prevent form submission from reloading the page

  // Get values from form fields
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  const dueDate = document.getElementById('taskDueDate').value;
  const status = 'to-do'; // Assuming all new tasks start in the "To Do" column

  // Create a new task object
  const newTask = {
      id: generateTaskId(), // Generate unique ID for the new task
      title: title,
      description: description,
      dueDate: dueDate,
      status: status
  };

  // Add the new task to the task list
  taskList.push(newTask);

  // Save the updated task list in localStorage
  localStorage.setItem('tasks', JSON.stringify(taskList));

  // Render the updated task list
  renderTaskList();

// Todo: create a function to handle deleting a task
function handleDeleteTask(taskId) {
  const taskIndex = taskList.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
      taskList.splice(taskIndex, 1);

      localStorage.setItem('tasks', JSON.stringify(taskList));
      renderTaskList();
   } }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // Get the dropped task element
  const droppedTask = ui.draggable;

  // Get the ID of the dropped task
  const taskId = parseInt(droppedTask.data('task-id'));

  // Get the new status based on the target lane's ID
  const newStatus = event.target.id.replace('-cards', '');

  // Find the dropped task in the task list
  const droppedTaskIndex = taskList.findIndex(task => task.id === taskId);

  // If the task is found
  if (droppedTaskIndex !== -1) {
      // Update the status of the dropped task
      taskList[droppedTaskIndex].status = newStatus;

      // Update the task list in localStorage
      localStorage.setItem('tasks', JSON.stringify(taskList));

      // Render the updated task list
      renderTaskList();
  }
}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // Render the task list
  renderTaskList();

  // Add event listeners
  $('#taskForm').submit(handleAddTask);

  // Make lanes droppable
  $('.lane').droppable({
      accept: '.card',
      drop: handleDrop
  });

  // Make the due date field a date picker
  $('#taskDueDate').datepicker({
      dateFormat: 'yy-mm-dd', // Set 
      minDate: 0 
  });
});
