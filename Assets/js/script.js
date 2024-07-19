$(document).ready(function() {
    // Array to hold tasks
    let taskList = [];

    // Retrieve tasks from localStorage if available
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        taskList = JSON.parse(storedTasks);
        renderTaskList();
    }

    // Function to generate a unique task ID
    function generateTaskId() {
        let nextId = localStorage.getItem('nextId') || 1;
        nextId = parseInt(nextId);
        localStorage.setItem('nextId', nextId + 1);
        return nextId;
    }

    // Function to create a task object
    function createTask(title, description, dueDate, status) {
        return {
            id: generateTaskId(),
            title: title,
            description: description,
            dueDate: dueDate,
            status: status
        };
    }

    // Function to render tasks on the Kanban board
    function renderTaskList() {
        $('#todo-cards').empty();
        $('#in-progress-cards').empty();
        $('#done-cards').empty();

        taskList.forEach(task => {
            const taskCard = createTaskCard(task);
            switch (task.status) {
                case 'todo':
                    $('#todo-cards').append(taskCard);
                    break;
                case 'in-progress':
                    $('#in-progress-cards').append(taskCard);
                    break;
                case 'done':
                    $('#done-cards').append(taskCard);
                    break;
                default:
                    break;
            }
        });

        makeCardsDraggable();
    }

    // Function to create a task card
    function createTaskCard(task) {
        const card = $('<div>')
            .attr('data-task-id', task.id)
            .addClass('card draggable')
            .append(
                $('<div>').addClass('card-body')
                    .append($('<h5>').addClass('card-title').text(task.title))
                    .append($('<p>').addClass('card-text').text(task.description))
                    .append($('<p>').addClass('card-text').text('Due: ' + task.dueDate))
                    .append($('<button>').addClass('btn btn-danger btn-sm').text('Delete').click(function() {
                        handleDeleteTask(task.id);
                    }))
            );

        return card;
    }

    // Function to make task cards draggable
    function makeCardsDraggable() {
        $('.draggable').draggable({
            revert: 'invalid',
            stack: '.draggable',
            containment: '.container',
            cursor: 'move'
        });
    }

    // Function to handle adding a new task
    $('#taskForm').submit(function(event) {
        event.preventDefault();
        const title = $('#taskTitle').val();
        const description = $('#taskDescription').val();
        const dueDate = $('#taskDueDate').val();
        const newTask = createTask(title, description, dueDate, 'todo');
        taskList.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(taskList));
        renderTaskList();
        $('#formModal').modal('hide');
        $('#taskForm')[0].reset();
    });

    // Function to handle deleting a task
    function handleDeleteTask(taskId) {
        taskList = taskList.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(taskList));
        renderTaskList();
    }

    // Function to handle dropping a task into a different lane
    $('.lane').droppable({
        accept: '.draggable',
        drop: function(event, ui) {
            const taskId = ui.draggable.attr('data-task-id');
            const newStatus = $(this).attr('id');
            const taskIndex = taskList.findIndex(task => task.id == taskId);
            if (taskIndex > -1) {
                taskList[taskIndex].status = newStatus;
                localStorage.setItem('tasks', JSON.stringify(taskList));
                renderTaskList();
            }
        }
    });

    // Make the due date field a date picker
    $('#taskDueDate').datepicker({
        dateFormat: 'yy-mm-dd', // Set the date format
        minDate: 0 
    });
});
