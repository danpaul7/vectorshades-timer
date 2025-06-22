const { ipcRenderer } = require('electron');

document.getElementById('minimize-icon').addEventListener('click', () => {
  ipcRenderer.send('minimize-window');
});
