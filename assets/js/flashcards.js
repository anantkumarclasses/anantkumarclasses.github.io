document.addEventListener("DOMContentLoaded", function () {
  const flashcards = [
      { question: "What are the 7 base units in the SI system?", answer: "meter (m), kilogram (kg), second (s), kelvin (K), ampere (A), candela (cd), mole (mol)" },
      { question: "What is the dimensional formula for force?", answer: "[Force] = MLT⁻²" },
      { question: "What is a significant figure?", answer: "All certain digits plus the last uncertain digit in a measured value." },
      { question: "What is the prefix for 10⁻⁶?", answer: "micro (µ)" },
      { question: "How do you combine errors in addition or subtraction?", answer: "Add the absolute errors of the individual quantities." },
      { question: "What does the principle of homogeneity state?", answer: "Both sides of a physical equation must have the same dimensions." },
      { question: "Dimensional formula for energy?", answer: "[Energy] = ML²T⁻²" },
      { question: "What is the act of measurement in physics?", answer: "A comparison of a physical quantity with a chosen reference standard." },
      { question: "What are the three criteria for a good standard of measurement?", answer: "Ease of availability, ease of reproducibility, and invariance under environmental changes." },
      { question: "What are the base units in the CGS, FPS, and MKS systems?", answer: "CGS: cm, g, s | FPS: ft, lb, s | MKS: m, kg, s" },
      { question: "What does SI stand for and what is its origin?", answer: "Système Internationale d’Unités, the international unit system." },
      { question: "Name the 2 supplementary units in the SI system.", answer: "Radian (rad), Steradian (sr)" },
      { question: "What are the rules for counting significant figures?", answer: "All non-zero digits; zeros between non-zero digits; trailing zeros after decimal; not leading zeros." },
      { question: "How are significant figures handled during multiplication and division?", answer: "Use the least number of significant figures among the operands." },
      { question: "How are significant figures handled during addition and subtraction?", answer: "Result must have the least number of decimal places." },
      { question: "What are the three types of errors in measurement?", answer: "Systematic errors, Random errors, Gross errors." },
      { question: "What are examples of systematic errors?", answer: "Least count error, zero error, parallax error, etc." },
      { question: "How do you express error quantitatively?", answer: "Using absolute, relative, and percentage errors." },
      { question: "What is the formula for absolute error?", answer: "|Δa| = |mean - measured value|" },
      { question: "How are errors combined during multiplication or division?", answer: "Add the fractional (relative) errors." },
      { question: "What is a dimensional formula?", answer: "An expression of a quantity in terms of base dimensions." },
      { question: "What is the principle of homogeneity of dimensions?", answer: "An equation must have the same dimensions on both sides." },
      { question: "What is a dimensionless quantity?", answer: "A quantity that has no dimensions; its value is the same in all units." },
      { question: "What is Buckingham’s Pi Theorem?", answer: "A principle that reduces physical relationships into dimensionless groups." },
      { question: "What is the dimensional formula for pressure?", answer: "[Pressure] = ML⁻¹T⁻²" },
      { question: "What does dimensional analysis of a pendulum reveal?", answer: "ω = C√(g/l), and it's independent of mass." },
      { question: "How does ω of water waves depend on wave number k?", answer: "ω = C√(gk)" },
      { question: "How is surface tension σ included in wave motion analysis?", answer: "Use the dimensionless ratio σk² / ρg in the function Φ." },
      { question: "How did dimensional analysis help in nuclear explosion analysis?", answer: "It led to R = C(Et²/ρ₀)^{1/5}, helping estimate energy." },
      { question: "What is the dimensional formula for acceleration?", answer: "[Acceleration] = LT⁻²" },
      { question: "What is the dimensional formula for power?", answer: "[Power] = ML²T⁻³" },
      { question: "What is the dimensional formula for electric charge?", answer: "[Charge] = IT" },
      { question: "What is the dimensional formula for electric potential?", answer: "[Electric potential] = ML²T⁻³I⁻¹" },
      { question: "What is the dimensional formula for resistance?", answer: "[Resistance] = ML²T⁻³I⁻²" },
      { question: "What is the dimensional formula for angular momentum?", answer: "[Angular momentum] = ML²T⁻¹" },
      { question: "What is the dimensional formula for gravitational constant (G)?", answer: "[G] = M⁻¹L³T⁻²" },
      { question: "What is the unit and symbol for luminous intensity?", answer: "Candela (cd)" },
      { question: "What is the prefix and symbol for 10¹²?", answer: "Tera (T)" },
      { question: "What is the dimensional formula for entropy?", answer: "[Entropy] = ML²T⁻²θ⁻¹" },
      { question: "What is the dimension of angle?", answer: "Dimensionless; [Angle] = 1" },
      { question: "What is the dimensional formula for moment of inertia?", answer: "[Moment of inertia] = ML²" },
      { question: "Which quantity has the dimensional formula ML⁻¹T⁻¹?", answer: "Viscosity" },
      { question: "What do we mean by dimensional independence?", answer: "A set of quantities is dimensionally independent if none can be derived from the others." }
    ];

  const app = document.getElementById("flashcard-app");

  app.innerHTML = `
    <h1>Units & Dimensions Flashcards</h1>
    <div id="cards-container"></div>
    <div class="nav-buttons">
      <button id="prev-btn">Previous</button>
      <button id="next-btn">Next</button>
    </div>
  `;

  const container = document.getElementById('cards-container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

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

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === flashcards.length - 1;
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

  renderCard(currentIndex);
});

