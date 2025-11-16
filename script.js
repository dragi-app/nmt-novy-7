// Скрипт для мінігри «Чистий фід»
// Гравець натискає на пости, в яких назви соцмереж написані за новими правилами.

document.addEventListener('DOMContentLoaded', () => {
  // Код гри починається після завантаження DOM.
  const startScreen = document.getElementById('start-screen');
  const startBtn = document.getElementById('start-btn');
  const gameContainer = document.getElementById('game-container');
  const finishScreen = document.getElementById('finish-screen');
  const triesContainer = document.getElementById('tries-container');
  const timerEl = document.getElementById('timer');
  const correctCountEl = document.getElementById('correct-count');
  const totalPostsEl = document.getElementById('total-posts');
  const feedContainer = document.getElementById('feed-container');
  const explanationEl = document.getElementById('explanation');
  const finishTextEl = document.getElementById('finish-text');
  const progressFill = document.querySelector('.general-progress-fill');

  // Створюємо зірки для фону
  const starContainer = document.getElementById('star-container');
  const NUM_STARS = 70;
  function createStars() {
    for (let i = 0; i < NUM_STARS; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 2 + 's';
      starContainer.appendChild(star);
    }
  }
  createStars();

  // Дані постів: текст, правильність та пояснення
  const postsData = [
    {
      text: 'Я побачив це в TikTok',
      correct: false,
      explanation:
        'Назву сервісу потрібно писати українською з маленької літери та відмінювати: «у тіктоці».',
    },
    {
      text: 'Я побачив це у тіктоці',
      correct: true,
      explanation:
        'Правильно! «Тіктоці» написане з малої літери та в правильному відмінку.',
    },
    {
      text: 'Я побачив це у тіктоку',
      correct: false,
      explanation:
        'Неправильне відмінювання. Має бути «у тіктоці».',
    },
    {
      text: 'Написав у Facebook',
      correct: false,
      explanation:
        'Назву соцмережі слід передавати українською: «у фейсбуці».',
    },
    {
      text: 'Написав у фейсбуці',
      correct: true,
      explanation:
        'Правильно! Назва сервісу відмінюється й пишеться з малої літери.',
    },
    {
      text: 'Подивився відео у ютубі',
      correct: true,
      explanation:
        'Правильно! Сервіс «ютуб» пишеться з малої літери й відмінюється.',
    },
    {
      text: 'Подивився відео в YouTube',
      correct: false,
      explanation:
        'Не відмінено й написано англійською. Правильно буде «у ютубі».',
    },
    {
      text: 'Читав статтю у телеграм-каналі',
      correct: true,
      explanation:
        'Правильно! Слово «телеграм» має писатися з малої літери та відмінюється.',
    },
    {
      text: 'Читав статтю у Telegram',
      correct: false,
      explanation:
        'Неправильно: назва сервісу англійською й без відмінювання.',
    },
  ];

  let shuffledPosts = [];
  let correctCount = 0;
  let mistakes = 0;
  const maxMistakes = 3; // кількість життів
  let timeLeft = 30; // секунд
  let timerInterval;

  startBtn.addEventListener('click', startGame);

  function startGame() {
    // Показати гру та приховати інші екрани
    startScreen.classList.add('hidden');
    finishScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');

    // Скинути дані
    shuffledPosts = shuffle(postsData);
    correctCount = 0;
    mistakes = 0;
    timeLeft = 30;
    updateTimerDisplay();
    correctCountEl.textContent = '0';
    totalPostsEl.textContent = shuffledPosts.length.toString();
    // Відмалювати серця
    triesContainer.innerHTML = '';
    for (let i = 0; i < maxMistakes; i++) {
      const heart = document.createElement('span');
      heart.classList.add('heart');
      heart.textContent = '❤';
      triesContainer.appendChild(heart);
    }
    // Очистити пояснення
    explanationEl.classList.add('hidden');
    explanationEl.textContent = '';
    // Заповнити стрічку
    renderFeed();
    // Запустити таймер
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        finishGame();
      }
    }, 1000);
  }

  // Експортуємо функцію startGame у глобальний простір, щоб викликати з HTML (onclick).
  window.startGame = startGame;

  // Перемішування масиву
  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function renderFeed() {
    feedContainer.innerHTML = '';
    shuffledPosts.forEach((postObj) => {
      const postEl = document.createElement('div');
      postEl.classList.add('post');
      postEl.textContent = postObj.text;
      postEl.dataset.correct = postObj.correct.toString();
      postEl.dataset.explanation = postObj.explanation;
      postEl.addEventListener('click', () => handlePostClick(postEl));
      feedContainer.appendChild(postEl);
    });
  }

  function handlePostClick(postEl) {
    if (postEl.classList.contains('disabled')) return;
    const isCorrect = postEl.dataset.correct === 'true';
    // Заборонити повторні натискання
    postEl.classList.add('disabled');
    postEl.removeEventListener('click', () => handlePostClick(postEl));
    // Показати пояснення
    explanationEl.textContent = postEl.dataset.explanation;
    explanationEl.classList.remove('hidden');
    if (isCorrect) {
      postEl.classList.add('correct');
      correctCount++;
      correctCountEl.textContent = correctCount.toString();
    } else {
      postEl.classList.add('incorrect');
      mistakes++;
      // Відмітити втрачений хіт
      const hearts = triesContainer.querySelectorAll('.heart');
      if (hearts[mistakes - 1]) {
        hearts[mistakes - 1].style.opacity = '0.2';
        hearts[mistakes - 1].classList.remove('heart');
      }
      if (mistakes >= maxMistakes) {
        // завершити гру
        finishGame();
        return;
      }
    }
    // Якщо всі пости вже оброблені (натиснуті), завершити гру до завершення таймера
    const remaining = Array.from(feedContainer.querySelectorAll('.post')).filter(
      (el) => !el.classList.contains('disabled')
    );
    if (remaining.length === 0) {
      finishGame();
    }
  }

  function updateTimerDisplay() {
    timerEl.textContent = timeLeft.toString();
  }

  function finishGame() {
    clearInterval(timerInterval);
    gameContainer.classList.add('hidden');
    finishScreen.classList.remove('hidden');
    // Сформувати текст фіналу
    finishTextEl.innerHTML =
      'Ти виправив <strong>' +
      correctCount +
      '</strong> постів. Кодове словосполучення "<strong>у&nbsp;тіктоці</strong>" — надішли його нашому магічному боту!';
    // Заповнити прогрес
    const progress = 7 / 9;
    if (progressFill) {
      progressFill.style.width = progress * 100 + '%';
    }
  }

  // Ніякий автозапуск не потрібен, гру запускає гравець через кнопку «Почати».
});
