(() => {
  const scriptPath = document.currentScript.src;
  const basePath = scriptPath.substring(0, scriptPath.lastIndexOf('/') + 1);
  fetch(basePath + 'header.html')
    .then(response => response.text())
    .then(data => {
      const headFragment = document.createRange().createContextualFragment(data);
      document.querySelector('header').appendChild(headFragment);
    })
    .catch(error => console.error('Error loading header:', error));
})();