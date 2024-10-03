document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const resetTasksButton = document.getElementById('reset-tasks');
  
    // Load tasks from storage
    chrome.storage.local.get(['tasks'], function (result) {
      const tasks = result.tasks || [];
      tasks.forEach(task => {
        addTaskToList(task);
      });
    });
  
    // Add a new task
    addTaskButton.addEventListener('click', function () {
      const task = taskInput.value.trim();
      if (task) {
        chrome.storage.local.get(['tasks'], function (result) {
          const tasks = result.tasks || [];
          tasks.push({ text: task, completed: false });
          chrome.storage.local.set({ 'tasks': tasks }, function () {
            addTaskToList({ text: task, completed: false });
            taskInput.value = ''; // Clear input
          });
        });
      }
    });
  
    // Reset tasks
    resetTasksButton.addEventListener('click', function () {
      chrome.storage.local.set({ 'tasks': [] }, function () {
        taskList.innerHTML = '';
        chrome.storage.local.set({ 'taskCompleted': false });
        alert('Tasks reset. You will be redirected back to the block page.');
        chrome.tabs.query({ url: "*://*.netflix.com/*" }, function (tabs) {
          tabs.forEach(function (tab) {
            chrome.tabs.reload(tab.id);
          });
        });
      });
    });
  
    // Helper function to add task to list
    function addTaskToList(task) {
      const li = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', function () {
        const isChecked = this.checked;
        updateTaskStatus(task.text, isChecked);
      });
      li.appendChild(checkbox);
      li.appendChild(document.createTextNode(task.text));
      taskList.appendChild(li);
    }
  
    // Update task status
    function updateTaskStatus(taskText, completed) {
      chrome.storage.local.get(['tasks'], function (result) {
        const tasks = result.tasks || [];
        const updatedTasks = tasks.map(task => {
          if (task.text === taskText) {
            return { ...task, completed };
          }
          return task;
        });
        chrome.storage.local.set({ 'tasks': updatedTasks }, function () {
          checkAllTasksCompleted();
        });
      });
    }
  
    // Check if all tasks are completed
    function checkAllTasksCompleted() {
      chrome.storage.local.get(['tasks'], function (result) {
        const tasks = result.tasks || [];
        const allCompleted = tasks.every(task => task.completed);
        chrome.storage.local.set({ 'taskCompleted': allCompleted });
      });
    }
  });
  