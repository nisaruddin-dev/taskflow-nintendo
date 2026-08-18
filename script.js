/* =========================================================
   TASKFLOW
   SMART TASK MANAGER
========================================================= */


/* =========================================================
   1. APPLICATION STATE
========================================================= */

let tasks = [];

let currentFilter = "all";

let currentSearch = "";

let currentSort = "newest";

let draggedTaskId = null;


/* =========================================================
   2. DOM ELEMENTS
========================================================= */

const taskForm =
    document.getElementById("task-form");

const taskTitle =
    document.getElementById("task-title");

const taskDescription =
    document.getElementById("task-description");

const taskPriority =
    document.getElementById("task-priority");

const taskCategory =
    document.getElementById("task-category");

const taskDate =
    document.getElementById("task-date");

const taskList =
    document.getElementById("task-list");

const emptyState =
    document.getElementById("empty-state");

const taskSearch =
    document.getElementById("task-search");

const sortTasks =
    document.getElementById("sort-tasks");

const filterButtons =
    document.querySelectorAll(".filter-button");

const taskCount =
    document.getElementById("task-count");

const totalTasks =
    document.getElementById("total-tasks");

const completedTasks =
    document.getElementById("completed-tasks");

const pendingTasks =
    document.getElementById("pending-tasks");

const highPriorityTasks =
    document.getElementById("high-priority-tasks");

const taskProgress =
    document.getElementById("task-progress");

const progressPercentage =
    document.getElementById("progress-percentage");

const currentDate =
    document.getElementById("current-date");

const themeToggle =
    document.getElementById("theme-toggle");

const completeAllButton =
    document.getElementById("complete-all");

const clearCompletedButton =
    document.getElementById("clear-completed");

const deleteAllButton =
    document.getElementById("delete-all");

const exportTasksButton =
    document.getElementById("export-tasks");

const importTasksButton =
    document.getElementById("import-tasks");

const importFile =
    document.getElementById("import-file");

const clearStorageButton =
    document.getElementById("clear-storage");


/* =========================================================
   EDIT MODAL ELEMENTS
========================================================= */

const editModal =
    document.getElementById("edit-modal");

const editTaskForm =
    document.getElementById("edit-task-form");

const editTaskId =
    document.getElementById("edit-task-id");

const editTaskTitle =
    document.getElementById("edit-task-title");

const editTaskDescription =
    document.getElementById("edit-task-description");

const editTaskPriority =
    document.getElementById("edit-task-priority");

const editTaskCategory =
    document.getElementById("edit-task-category");

const editTaskDate =
    document.getElementById("edit-task-date");

const closeModal =
    document.getElementById("close-modal");

const cancelEdit =
    document.getElementById("cancel-edit");


/* =========================================================
   3. INITIALIZE APPLICATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadTasks();

        loadTheme();

        displayCurrentDate();

        renderTasks();

        updateStatistics();

        console.log(
            "TaskFlow initialized successfully."
        );

    }
);


/* =========================================================
   4. LOCAL STORAGE
========================================================= */

function loadTasks() {

    const savedTasks =
        localStorage.getItem("taskflowTasks");

    if (savedTasks) {

        try {

            tasks = JSON.parse(savedTasks);

        } catch (error) {

            console.error(
                "Could not load saved tasks.",
                error
            );

            tasks = [];

        }

    }

}


function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


/* =========================================================
   5. ADD TASK
========================================================= */

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const title =
            taskTitle.value.trim();

        const description =
            taskDescription.value.trim();

        const priority =
            taskPriority.value;

        const category =
            taskCategory.value;

        const dueDate =
            taskDate.value;


        if (!title) {

            alert(
                "Please enter a task title."
            );

            taskTitle.focus();

            return;

        }


        const newTask = {

            id:
                Date.now().toString(),

            title:
                title,

            description:
                description,

            priority:
                priority,

            category:
                category,

            dueDate:
                dueDate,

            completed:
                false,

            createdAt:
                new Date().toISOString()

        };


        tasks.unshift(newTask);


        saveTasks();

        renderTasks();

        updateStatistics();


        taskForm.reset();


        taskTitle.focus();


        console.log(
            "New task added:",
            newTask
        );

    }
);


/* =========================================================
   6. RENDER TASKS
========================================================= */

function renderTasks() {

    const filteredTasks =
        getFilteredTasks();


    const taskCards =
        taskList.querySelectorAll(
            ".task-card"
        );


    taskCards.forEach(function (card) {

        card.remove();

    });


    if (filteredTasks.length === 0) {

        emptyState.hidden = false;

        updateEmptyMessage();

    } else {

        emptyState.hidden = true;

        filteredTasks.forEach(
            function (task) {

                const taskCard =
                    createTaskCard(task);

                taskList.appendChild(
                    taskCard
                );

            }
        );

    }


    updateTaskCount(
        filteredTasks.length
    );

}


/* =========================================================
   7. CREATE TASK CARD
========================================================= */

function createTaskCard(task) {

    const article =
        document.createElement("article");


    article.className =
        "task-card";


    if (task.completed) {

        article.classList.add(
            "completed"
        );

    }


    article.dataset.taskId =
        task.id;

    article.dataset.priority =
        task.priority;

    article.dataset.category =
        task.category;

    article.draggable = true;


    const dragHandle =
        document.createElement("div");

    dragHandle.className =
        "task-drag-handle";

    dragHandle.textContent =
        "☷";


    const checkboxContainer =
        document.createElement("div");

    checkboxContainer.className =
        "task-checkbox";


    const checkbox =
        document.createElement("input");

    checkbox.type =
        "checkbox";

    checkbox.className =
        "complete-checkbox";

    checkbox.checked =
        task.completed;

    checkbox.id =
        `complete-${task.id}`;


    const checkboxLabel =
        document.createElement("label");

    checkboxLabel.htmlFor =
        checkbox.id;

    checkboxLabel.innerHTML =
        `<span class="visually-hidden">
            Mark task as complete
        </span>`;


    checkboxContainer.appendChild(
        checkbox
    );

    checkboxContainer.appendChild(
        checkboxLabel
    );


    const content =
        document.createElement("div");

    content.className =
        "task-content";


    const title =
        document.createElement("h3");

    title.className =
        "task-title";

    title.textContent =
        task.title;


    const description =
        document.createElement("p");

    description.className =
        "task-description";

    description.textContent =
        task.description ||
        "No description provided.";


    const meta =
        document.createElement("div");

    meta.className =
        "task-meta";


    const priority =
        document.createElement("span");

    priority.className =
        "task-priority";

    priority.textContent =
        capitalize(task.priority);


    const category =
        document.createElement("span");

    category.className =
        "task-category";

    category.textContent =
        capitalize(task.category);


    const dueDate =
        document.createElement("span");

    dueDate.className =
        "task-due-date";

    dueDate.textContent =
        task.dueDate
            ? `Due: ${formatDate(task.dueDate)}`
            : "No due date";


    meta.appendChild(priority);

    meta.appendChild(category);

    meta.appendChild(dueDate);


    content.appendChild(title);

    content.appendChild(description);

    content.appendChild(meta);


    const actions =
        document.createElement("div");

    actions.className =
        "task-actions";


    const editButton =
        document.createElement("button");

    editButton.className =
        "edit-task";

    editButton.type =
        "button";

    editButton.dataset.action =
        "edit";

    editButton.setAttribute(
        "aria-label",
        "Edit task"
    );

    editButton.textContent =
        "✏️";


    const deleteButton =
        document.createElement("button");

    deleteButton.className =
        "delete-task";

    deleteButton.type =
        "button";

    deleteButton.dataset.action =
        "delete";

    deleteButton.setAttribute(
        "aria-label",
        "Delete task"
    );

    deleteButton.textContent =
        "🗑️";


    actions.appendChild(
        editButton
    );

    actions.appendChild(
        deleteButton
    );


    article.appendChild(
        dragHandle
    );

    article.appendChild(
        checkboxContainer
    );

    article.appendChild(
        content
    );

    article.appendChild(
        actions
    );


    return article;

}


/* =========================================================
   8. TASK CARD EVENTS
   EVENT DELEGATION
========================================================= */

taskList.addEventListener(
    "click",
    function (event) {

        const card =
            event.target.closest(
                ".task-card"
            );


        if (!card) {

            return;

        }


        const taskId =
            card.dataset.taskId;


        if (
            event.target.closest(
                ".edit-task"
            )
        ) {

            openEditModal(taskId);

            return;

        }


        if (
            event.target.closest(
                ".delete-task"
            )
        ) {

            deleteTask(taskId);

            return;

        }

    }
);


/* =========================================================
   9. COMPLETE TASK
========================================================= */

taskList.addEventListener(
    "change",
    function (event) {

        if (
            !event.target.classList.contains(
                "complete-checkbox"
            )
        ) {

            return;

        }


        const card =
            event.target.closest(
                ".task-card"
            );


        const taskId =
            card.dataset.taskId;


        const task =
            tasks.find(
                function (item) {

                    return item.id === taskId;

                }
            );


        if (!task) {

            return;

        }


        task.completed =
            event.target.checked;


        saveTasks();

        renderTasks();

        updateStatistics();

    }
);


/* =========================================================
   10. DELETE TASK
========================================================= */

function deleteTask(taskId) {

    const task =
        tasks.find(
            function (item) {

                return item.id === taskId;

            }
        );


    if (!task) {

        return;

    }


    const confirmed =
        confirm(
            `Delete "${task.title}"?`
        );


    if (!confirmed) {

        return;

    }


    tasks =
        tasks.filter(
            function (item) {

                return item.id !== taskId;

            }
        );


    saveTasks();

    renderTasks();

    updateStatistics();

}


/* =========================================================
   11. EDIT TASK
========================================================= */

function openEditModal(taskId) {

    const task =
        tasks.find(
            function (item) {

                return item.id === taskId;

            }
        );


    if (!task) {

        return;

    }


    editTaskId.value =
        task.id;

    editTaskTitle.value =
        task.title;

    editTaskDescription.value =
        task.description;

    editTaskPriority.value =
        task.priority;

    editTaskCategory.value =
        task.category;

    editTaskDate.value =
        task.dueDate;


    editModal.hidden =
        false;


    editTaskTitle.focus();

}


function closeEditModal() {

    editModal.hidden =
        true;

}


closeModal.addEventListener(
    "click",
    closeEditModal
);


cancelEdit.addEventListener(
    "click",
    closeEditModal
);


/* Close when clicking outside modal */

editModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === editModal
        ) {

            closeEditModal();

        }

    }
);


/* =========================================================
   12. SAVE EDITED TASK
========================================================= */

editTaskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const id =
            editTaskId.value;


        const task =
            tasks.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!task) {

            return;

        }


        task.title =
            editTaskTitle.value.trim();

        task.description =
            editTaskDescription.value.trim();

        task.priority =
            editTaskPriority.value;

        task.category =
            editTaskCategory.value;

        task.dueDate =
            editTaskDate.value;


        if (!task.title) {

            alert(
                "Task title cannot be empty."
            );

            return;

        }


        saveTasks();

        renderTasks();

        updateStatistics();

        closeEditModal();

    }
);


/* =========================================================
   13. SEARCH
========================================================= */

taskSearch.addEventListener(
    "input",
    function () {

        currentSearch =
            this.value.trim().toLowerCase();

        renderTasks();

    }
);


/* =========================================================
   14. FILTER BUTTONS
========================================================= */

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


                currentFilter =
                    this.dataset.filter;


                renderTasks();

            }
        );

    }
);


/* =========================================================
   15. GET FILTERED TASKS
========================================================= */

function getFilteredTasks() {

    let result =
        [...tasks];


    /* SEARCH */

    if (currentSearch) {

        result =
            result.filter(
                function (task) {

                    return (
                        task.title
                            .toLowerCase()
                            .includes(currentSearch)

                        ||

                        task.description
                            .toLowerCase()
                            .includes(currentSearch)

                        ||

                        task.category
                            .toLowerCase()
                            .includes(currentSearch)

                    );

                }
            );

    }


    /* FILTER */

    if (
        currentFilter ===
        "pending"
    ) {

        result =
            result.filter(
                function (task) {

                    return !task.completed;

                }
            );

    }


    if (
        currentFilter ===
        "completed"
    ) {

        result =
            result.filter(
                function (task) {

                    return task.completed;

                }
            );

    }


    if (
        currentFilter ===
        "high"
    ) {

        result =
            result.filter(
                function (task) {

                    return (
                        task.priority ===
                        "high"
                    );

                }
            );

    }


    return sortTaskArray(result);

}


/* =========================================================
   16. SORT TASKS
========================================================= */

sortTasks.addEventListener(
    "change",
    function () {

        currentSort =
            this.value;

        renderTasks();

    }
);


function sortTaskArray(taskArray) {

    const sorted =
        [...taskArray];


    if (
        currentSort ===
        "newest"
    ) {

        sorted.sort(
            function (a, b) {

                return (
                    new Date(b.createdAt)
                    -
                    new Date(a.createdAt)
                );

            }
        );

    }


    if (
        currentSort ===
        "oldest"
    ) {

        sorted.sort(
            function (a, b) {

                return (
                    new Date(a.createdAt)
                    -
                    new Date(b.createdAt)
                );

            }
        );

    }


    if (
        currentSort ===
        "alphabetical"
    ) {

        sorted.sort(
            function (a, b) {

                return a.title.localeCompare(
                    b.title
                );

            }
        );

    }


    if (
        currentSort ===
        "priority"
    ) {

        const priorityOrder = {

            high: 1,

            medium: 2,

            low: 3

        };


        sorted.sort(
            function (a, b) {

                return (
                    priorityOrder[a.priority]
                    -
                    priorityOrder[b.priority]
                );

            }
        );

    }


    if (
        currentSort ===
        "due-date"
    ) {

        sorted.sort(
            function (a, b) {

                if (!a.dueDate) {

                    return 1;

                }


                if (!b.dueDate) {

                    return -1;

                }


                return (
                    new Date(a.dueDate)
                    -
                    new Date(b.dueDate)
                );

            }
        );

    }


    return sorted;

}


/* =========================================================
   17. UPDATE STATISTICS
========================================================= */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function (task) {

                return task.completed;

            }
        ).length;


    const pending =
        total - completed;


    const highPriority =
        tasks.filter(
            function (task) {

                return (
                    task.priority ===
                    "high"
                    &&
                    !task.completed
                );

            }
        ).length;


    totalTasks.textContent =
        total;

    completedTasks.textContent =
        completed;

    pendingTasks.textContent =
        pending;

    highPriorityTasks.textContent =
        highPriority;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    taskProgress.value =
        percentage;

    progressPercentage.textContent =
        `${percentage}%`;

}


/* =========================================================
   18. TASK COUNT
========================================================= */

function updateTaskCount(count) {

    taskCount.textContent =
        count === 1
            ? "1 task"
            : `${count} tasks`;

}


/* =========================================================
   19. EMPTY STATE
========================================================= */

function updateEmptyMessage() {

    if (currentSearch) {

        emptyState.querySelector(
            "h3"
        ).textContent =
            "No matching tasks";

        emptyState.querySelector(
            "p"
        ).textContent =
            "Try a different search.";

        return;

    }


    if (
        currentFilter ===
        "completed"
    ) {

        emptyState.querySelector(
            "h3"
        ).textContent =
            "No completed tasks";

        emptyState.querySelector(
            "p"
        ).textContent =
            "Complete a task and it will appear here.";

        return;

    }


    if (
        currentFilter ===
        "pending"
    ) {

        emptyState.querySelector(
            "h3"
        ).textContent =
            "No pending tasks";

        emptyState.querySelector(
            "p"
        ).textContent =
            "You're all caught up!";

        return;

    }


    if (
        currentFilter ===
        "high"
    ) {

        emptyState.querySelector(
            "h3"
        ).textContent =
            "No high-priority tasks";

        emptyState.querySelector(
            "p"
        ).textContent =
            "Your high-priority list is clear.";

        return;

    }


    emptyState.querySelector(
        "h3"
    ).textContent =
        "No tasks yet";

    emptyState.querySelector(
        "p"
    ).textContent =
        "Add your first task to get started.";

}


/* =========================================================
   20. COMPLETE ALL TASKS
========================================================= */

completeAllButton.addEventListener(
    "click",
    function () {

        if (tasks.length === 0) {

            alert(
                "There are no tasks to complete."
            );

            return;

        }


        tasks.forEach(
            function (task) {

                task.completed = true;

            }
        );


        saveTasks();

        renderTasks();

        updateStatistics();

    }
);


/* =========================================================
   21. CLEAR COMPLETED TASKS
========================================================= */

clearCompletedButton.addEventListener(
    "click",
    function () {

        const completedCount =
            tasks.filter(
                function (task) {

                    return task.completed;

                }
            ).length;


        if (completedCount === 0) {

            alert(
                "There are no completed tasks."
            );

            return;

        }


        const confirmed =
            confirm(
                `Remove ${completedCount} completed task(s)?`
            );


        if (!confirmed) {

            return;

        }


        tasks =
            tasks.filter(
                function (task) {

                    return !task.completed;

                }
            );


        saveTasks();

        renderTasks();

        updateStatistics();

    }
);


/* =========================================================
   22. DELETE ALL TASKS
========================================================= */

deleteAllButton.addEventListener(
    "click",
    function () {

        if (tasks.length === 0) {

            alert(
                "There are no tasks to delete."
            );

            return;

        }


        const confirmed =
            confirm(
                "Are you sure you want to delete ALL tasks?"
            );


        if (!confirmed) {

            return;

        }


        tasks = [];


        saveTasks();

        renderTasks();

        updateStatistics();

    }
);


/* =========================================================
   23. DRAG & DROP
========================================================= */

taskList.addEventListener(
    "dragstart",
    function (event) {

        const card =
            event.target.closest(
                ".task-card"
            );


        if (!card) {

            return;

        }


        draggedTaskId =
            card.dataset.taskId;


        card.classList.add(
            "dragging"
        );


        event.dataTransfer.effectAllowed =
            "move";


        event.dataTransfer.setData(
            "text/plain",
            draggedTaskId
        );

    }
);


taskList.addEventListener(
    "dragend",
    function (event) {

        const card =
            event.target.closest(
                ".task-card"
            );


        if (card) {

            card.classList.remove(
                "dragging"
            );

        }


        draggedTaskId = null;

    }
);


taskList.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();


        const draggingCard =
            taskList.querySelector(
                ".dragging"
            );


        if (!draggingCard) {

            return;

        }


        const afterElement =
            getDragAfterElement(
                taskList,
                event.clientY
            );


        if (afterElement == null) {

            taskList.appendChild(
                draggingCard
            );

        } else {

            taskList.insertBefore(
                draggingCard,
                afterElement
            );

        }

    }
);


taskList.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();


        const orderedIds =
            [...taskList.querySelectorAll(
                ".task-card"
            )].map(
                function (card) {

                    return card.dataset.taskId;

                }
            );


        const reorderedTasks = [];


        orderedIds.forEach(
            function (id) {

                const task =
                    tasks.find(
                        function (item) {

                            return item.id === id;

                        }
                    );


                if (task) {

                    reorderedTasks.push(
                        task
                    );

                }

            }
        );


        /*
            Add tasks that are currently
            hidden because of filtering.
        */

        tasks.forEach(
            function (task) {

                if (
                    !orderedIds.includes(
                        task.id
                    )
                ) {

                    reorderedTasks.push(
                        task
                    );

                }

            }
        );


        tasks =
            reorderedTasks;


        saveTasks();

        renderTasks();

    }
);


/* =========================================================
   24. FIND DRAG POSITION
========================================================= */

function getDragAfterElement(
    container,
    mouseY
) {

    const draggableElements =
        [
            ...container.querySelectorAll(
                ".task-card:not(.dragging)"
            )
        ];


    return draggableElements.reduce(
        function (closest, child) {

            const box =
                child.getBoundingClientRect();


            const offset =
                mouseY -
                box.top -
                box.height / 2;


            if (
                offset < 0 &&
                offset > closest.offset
            ) {

                return {

                    offset: offset,

                    element: child

                };

            }


            return closest;

        },
        {
            offset:
                Number.NEGATIVE_INFINITY,

            element:
                null
        }

    ).element;

}


/* =========================================================
   25. EXPORT TASKS
========================================================= */

exportTasksButton.addEventListener(
    "click",
    function () {

        if (tasks.length === 0) {

            alert(
                "There are no tasks to export."
            );

            return;

        }


        const data =
            JSON.stringify(
                tasks,
                null,
                2
            );


        const blob =
            new Blob(
                [data],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;

        link.download =
            "taskflow-backup.json";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );

    }
);


/* =========================================================
   26. IMPORT TASKS
========================================================= */

importTasksButton.addEventListener(
    "click",
    function () {

        importFile.click();

    }
);


importFile.addEventListener(
    "change",
    function (event) {

        const file =
            event.target.files[0];


        if (!file) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function () {

                try {

                    const importedTasks =
                        JSON.parse(
                            reader.result
                        );


                    if (
                        !Array.isArray(
                            importedTasks
                        )
                    ) {

                        throw new Error(
                            "Invalid task file."
                        );

                    }


                    const confirmed =
                        confirm(
                            "Importing tasks will replace your current tasks. Continue?"
                        );


                    if (!confirmed) {

                        importFile.value =
                            "";

                        return;

                    }


                    tasks =
                        importedTasks;


                    saveTasks();

                    renderTasks();

                    updateStatistics();


                    alert(
                        "Tasks imported successfully."
                    );


                } catch (error) {

                    console.error(
                        error
                    );


                    alert(
                        "Could not import the selected file."
                    );

                }


                importFile.value =
                    "";

            };


        reader.readAsText(
            file
        );

    }
);


/* =========================================================
   27. CLEAR LOCAL STORAGE
========================================================= */

clearStorageButton.addEventListener(
    "click",
    function () {

        const confirmed =
            confirm(
                "This will permanently delete your saved TaskFlow data. Continue?"
            );


        if (!confirmed) {

            return;

        }


        localStorage.removeItem(
            "taskflowTasks"
        );


        tasks = [];


        renderTasks();

        updateStatistics();


        alert(
            "Saved TaskFlow data has been cleared."
        );

    }
);


/* =========================================================
   28. THEME SYSTEM
========================================================= */

themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "light-theme"
        );


        const isLight =
            document.body.classList.contains(
                "light-theme"
            );


        localStorage.setItem(
            "taskflowTheme",
            isLight
                ? "light"
                : "dark"
        );


        themeToggle.textContent =
            isLight
                ? "☀️"
                : "🌙";

    }
);


/* =========================================================
   29. LOAD SAVED THEME
========================================================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "taskflowTheme"
        );


    if (
        savedTheme ===
        "light"
    ) {

        document.body.classList.add(
            "light-theme"
        );


        themeToggle.textContent =
            "☀️";

    }

}


/* =========================================================
   30. CURRENT DATE
========================================================= */

function displayCurrentDate() {

    const today =
        new Date();


    currentDate.textContent =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "long",

                year: "numeric",

                month: "long",

                day: "numeric"
            }
        );

}


/* =========================================================
   31. DATE FORMATTER
========================================================= */

function formatDate(dateString) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",

            day: "numeric",

            year: "numeric"
        }
    );

}


/* =========================================================
   32. CAPITALIZE TEXT
========================================================= */

function capitalize(text) {

    if (!text) {

        return "";

    }


    return (
        text.charAt(0).toUpperCase()
        +
        text.slice(1)
    );

}


/* =========================================================
   33. KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        /*
            Ctrl/Cmd + K
            Focus search
        */

        if (
            (event.ctrlKey ||
                event.metaKey)
            &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            taskSearch.focus();

        }


        /*
            Escape
            Close edit modal
        */

        if (
            event.key === "Escape"
            &&
            !editModal.hidden
        ) {

            closeEditModal();

        }

    }
);


/* =========================================================
   34. PREVENT ENTER FROM SUBMITTING
   IN TEXTAREA
========================================================= */

taskDescription.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
            &&
            event.ctrlKey
        ) {

            taskForm.requestSubmit();

        }

    }
);


/* =========================================================
   35. DEBUG INFORMATION
========================================================= */

console.log(
    "======================================"
);

console.log(
    "TaskFlow Smart Task Manager"
);

console.log(
    "JavaScript loaded successfully."
);

console.log(
    "Tasks currently stored:",
    tasks.length
);

console.log(
    "======================================"
);