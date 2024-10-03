chrome.webNavigation.onCompleted.addListener(function (details) {
    chrome.storage.local.get(['tasks', 'taskCompleted'], function (result) {
      const tasks = result.tasks || [];
      const taskCompleted = result.taskCompleted;
      
      // Check if tasks are incomplete and block the page
      if (tasks.length > 0 && !taskCompleted) {
        chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('block-page.html') });
      }
    });
  }, { url: [{ hostContains: 'netflix.com' }] });
  
  // Listen for changes in storage
  chrome.storage.onChanged.addListener(function (changes) {
    if (changes.taskCompleted) {
      chrome.tabs.query({ url: "*://*.netflix.com/*" }, function (tabs) {
        tabs.forEach(function (tab) {
          chrome.tabs.reload(tab.id);
        });
      });
    }
  });
  