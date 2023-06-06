const container = document.querySelector('.theme-container');
const themeIcon = document.getElementById('theme-icon');
const tipsSection = document.querySelector('.tips-section');
let theme = localStorage.getItem('theme') || 'system';

function setTheme() {
  switch (theme) {
    case 'dark':
      setDark();
      break;
    case 'light':
      setLight();
      break;
    case 'system':
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDark();
      } else {
        setLight();
      }
      break;
  }
}

function toggleTheme() {
  if (theme === 'dark') {
    setLight();
  } else {
    setDark();
  }
}

function setLight() {
  document.documentElement.classList.remove('dark-mode');
  themeIcon.src = "https://www.uplooder.net/img/image/55/7aa9993fc291bc170abea048589896cf/sun.svg";
  themeIcon.classList.remove("change");
  container.classList.remove("shadow-dark");
  setTimeout(() => {
    container.classList.add("shadow-light");
  }, 300);
  themeIcon.classList.add("change");
  tipsSection.classList.remove('dark-mode'); // Remover a classe para a cor padrão
  theme = 'light';
  localStorage.setItem('theme', 'light');
}

function setDark() {
  document.documentElement.classList.add('dark-mode');
  themeIcon.src = "https://www.uplooder.net/img/image/2/addf703a24a12d030968858e0879b11e/moon.svg";
  themeIcon.classList.remove("change");
  container.classList.remove("shadow-light");
  setTimeout(() => {
    container.classList.add("shadow-dark");
  }, 300);
  themeIcon.classList.add("change");
  tipsSection.classList.add('dark-mode'); // Adicionar a classe para a cor desejada
  theme = 'dark';
  localStorage.setItem('theme', 'dark');
}

// Definir o tema inicial
setTheme();

// Adicionar evento de clique ao container
container.addEventListener('click', toggleTheme);
