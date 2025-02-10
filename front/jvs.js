document.addEventListener('DOMContentLoaded', (event) => {
  const helpButton = document.getElementById('help-btn');
  helpButton.addEventListener('click', () => {
      window.location.href = 'https://example.com/your-help-page'; // Replace with your actual help page URL
  });

  // Modal functionality
  const modal = document.getElementById('myModal');
  const btn = document.getElementById('myBtn');
  const span = document.getElementsByClassName('close')[0];

  btn.onclick = function() {
      modal.style.display = 'block';
  }

  span.onclick = function() {
      modal.style.display = 'none';
  }

  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  }
});
