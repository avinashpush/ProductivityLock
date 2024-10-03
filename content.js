// content.js

const overlayHtml = `
  <div id="motivator-overlay" style="
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    font-family: Arial, sans-serif;
    text-align: center;
    font-size: 20px;
    padding: 20px;
    box-sizing: border-box;
  ">
    <div>
      <h1>Access Blocked</h1>
      <p>Please complete your tasks in your extension to access this page.</p>
    </div>
  </div>
`;

window.addEventListener('load', () => {
  chrome.storage.local.get('taskCompleted', (data) => {
    if (!data.taskCompleted) {
      document.body.insertAdjacentHTML('beforeend', overlayHtml);
    }
  });
});
