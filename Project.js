const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");

const btn = document.getElementById("search-btn");
const themeToggle = document.getElementById('theme-toggle');

// Theme Toggle Event Listener
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', themeToggle.checked);
  document.querySelector('.container').classList.toggle('dark-mode', themeToggle.checked);
  document.querySelector('.search-box input').classList.toggle('dark-mode', themeToggle.checked);
  document.querySelector('.search-box button').classList.toggle('dark-mode', themeToggle.checked);
  document.querySelectorAll('.result h3').forEach(el => el.classList.toggle('dark-mode', themeToggle.checked));
  document.querySelectorAll('.result button').forEach(el => el.classList.toggle('dark-mode', themeToggle.checked));
  document.querySelectorAll('.result .details').forEach(el => el.classList.toggle('dark-mode', themeToggle.checked));
  document.querySelectorAll('.words-meaning').forEach(el => el.classList.toggle('dark-mode', themeToggle.checked));
  document.querySelectorAll('.word-example').forEach(el => el.classList.toggle('dark-mode', themeToggle.checked));
});

btn.addEventListener("click", () => {
  let inpWord = document.getElementById("inp-word").value.trim();
  console.log(inpWord);
  if (inpWord) {
    fetch(`${url}${inpWord}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const wordData = data[0];
          const phonetics = wordData.phonetics;
          const partOfSpeech = wordData.meanings[0]?.partOfSpeech || '';
          const definition = wordData.meanings[0]?.definitions[0]?.definition || 'No definition found';
          const example = wordData.meanings[0]?.definitions[0]?.example || 'No example available';

          let audioUrl = '';
          for (let i = 0; i < phonetics.length; i++) {
            if (phonetics[i].audio) {
              audioUrl = phonetics[i].audio;
              break;
            }
          }

          const phoneticText = phonetics[0]?.text || '';

          result.innerHTML = `
            <div class="word">
              <h3>${inpWord}</h3>
              <button onclick="playSound('${audioUrl}')">
                <i class="fa-solid fa-volume-high"></i>
              </button>
            </div>
            <div class="details">
              <p>${partOfSpeech}</p>
              <p>${phoneticText}</p>
            </div>
            <p class="words-meaning">
              ${definition}
            </p>
            <p class="word-example">
              <strong>Example:</strong> ${example}
            </p>
          `;
          // Autoplay sound
          if (audioUrl) {
            playSound(audioUrl);
          }
        } else {
          result.innerHTML = `<p class="error">Word not found. Please try again!</p>`;
        }
      })
      .catch(() => {
        result.innerHTML = `<p class="error">Something went wrong. Please try again later.</p>`;
      });
  } else {
    result.innerHTML = `<p class="error">Please enter a word to search!</p>`;
  }
});

function playSound(audioUrl) {
  sound.setAttribute("src", audioUrl);
  sound.play();
}
