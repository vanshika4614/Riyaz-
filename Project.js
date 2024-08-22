const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");

const btn = document.getElementById("search-btn");
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', themeToggle.checked);
  document.querySelector('.container').classList.toggle('dark-mode', themeToggle.checked);
  document.querySelector('.search-box input').classList.toggle('dark-mode', themeToggle.checked);
  document.querySelector('.search-box button').classList.toggle('dark-mode', themeToggle.checked);
  document.querySelector('.logo h2').classList.toggle('dark-mode', themeToggle.checked);
  document.querySelectorAll('.result h3').forEach(el => el.classList.toggle('dark-mode', themeToggle.checked));
  document.querySelectorAll('.result button').forEach(el => el.classList.toggle('dark-mode', themeToggle.checked));
  document.querySelectorAll('.result .details').forEach(el => el.classList.toggle('dark-mode', themeToggle.checked));
  document.querySelectorAll('.words-meaning').forEach(el => el.classList.toggle('dark-mode', themeToggle.checked));
  document.querySelectorAll('.word-example').forEach(el => el.classList.toggle('dark-mode', themeToggle.checked));
  document.querySelectorAll('.word-synonyms').forEach(el => el.classList.toggle('dark-mode', themeToggle.checked));
});

btn.addEventListener("click", () => {
  let inpWord = document.getElementById("inp-word").value.trim();
  if (inpWord) {
    fetch(`${url}${inpWord}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.title && data.message) {
          result.innerHTML = `<h3 class="error">Word not found.</h3>`;
        } else {
          const wordData = data[0];
          const wordMeaning = wordData.meanings[0];
          const phoneticAudio = wordData.phonetics.find(p => p.audio)?.audio || '';
          result.innerHTML = `
            <div class="word">
              <h3>${inpWord}</h3>
              <button onclick="playSound('${phoneticAudio}')">
                <i class="fa-solid fa-volume-high"></i>
              </button>
            </div>
            <div class="details">
              <p>${wordMeaning.partOfSpeech}</p>
              <p>${wordData.phonetics[0]?.text || ''}</p>
            </div>
            <p class="words-meaning">
              ${wordMeaning.definitions[0].definition}
            </p>
            ${wordMeaning.definitions[0].example ? `<p class="word-example"><strong>Example:</strong> ${wordMeaning.definitions[0].example}</p>` : ''}
            ${
              wordMeaning.synonyms && wordMeaning.synonyms.length
                ? `<p class="word-synonyms"><strong>Synonyms:</strong> ${wordMeaning.synonyms.join(', ')}</p>`
                : ''
            }
          `;
          // Autoplay sound if available
          if (phoneticAudio) {
            sound.src = phoneticAudio;
            sound.play();
          }
        }
      })
      .catch(() => {
        result.innerHTML = `<h3 class="error">Error fetching data.</h3>`;
      });
  }
});

function playSound(src) {
  if (src) {
    sound.src = src;
    sound.play();
  }
}


