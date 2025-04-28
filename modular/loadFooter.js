fetch('../modular/footer.html')
  .then(response => response.text())
  .then(data => {
    const headFragment = document.createRange().createContextualFragment(data);
    document.querySelector('footer').appendChild(headFragment);
  })
  .catch(error => console.error('Error loading footer:', error));