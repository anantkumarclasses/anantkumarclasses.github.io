document.addEventListener("DOMContentLoaded", function () {
  const app = document.getElementById("flashcard-app");

  app.innerHTML = `
    <div id="cards-container"></div>
    <div class="nav-buttons">
      <button id="prev-btn">Previous</button>
      <button id="next-btn">Next</button>
    </div>
  `;

  const container = document.getElementById('cards-container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  let flashcards = [];
  let currentIndex = 0;

  function renderCard(index) {
    container.innerHTML = '';
    const data = flashcards[index];

    const card = document.createElement('div');
    card.className = 'flashcard';

    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';

    const front = document.createElement('div');
    front.className = 'card-front';
    front.textContent = data.question;

    const back = document.createElement('div');
    back.className = 'card-back';
    back.textContent = data.answer;

    cardInner.appendChild(front);
    cardInner.appendChild(back);
    card.appendChild(cardInner);
    container.appendChild(card);

    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === flashcards.length - 1;
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderCard(currentIndex);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < flashcards.length - 1) {
      currentIndex++;
      renderCard(currentIndex);
    }
  });

  // --- Dynamically load flashcards from JSON file defined in the page ---
  if (typeof flashcardDataUrl !== 'undefined') {
    fetch(flashcardDataUrl)
      .then(res => res.json())
      .then(data => {
        flashcards = data;
        renderCard(currentIndex);
      })
      .catch(err => {
        container.innerHTML = `<p style="color:red;">Failed to load flashcards: ${err}</p>`;
        console.error(err);
      });
  } else {
    container.innerHTML = "<p style='color:red;'>No flashcard data source specified.</p>";
  }
});

