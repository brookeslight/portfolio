fetch('./modular/head.html')
  .then(response => response.text())
  .then(data => {
    const headFragment = document.createRange().createContextualFragment(data);
    document.querySelector('head').appendChild(headFragment);
  })
  .catch(error => console.error('Error loading head:', error));