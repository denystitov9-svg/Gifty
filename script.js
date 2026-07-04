// Переключение вкладок "Возраст" и "Интересы" на главном экране
function switchTab(tabName) {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  document.getElementById("age-section").classList.remove("active");
  document.getElementById("interests-section").classList.remove("active");

  document.getElementById(`${tabName}-section`).classList.add("active");
}

// Главная магия интерфейса: открываем категорию, прячем ВСЁ остальное
function filterGifts(categoryKey, categoryName) {
  const mainInterface = document.getElementById("main-interface");
  const viewInterface = document.getElementById("view-interface");
  const container = document.getElementById("gifts-container");
  const title = document.getElementById("current-category-title");

  // Очищаем контейнер карточек перед выводом новых
  container.innerHTML = "";

  // Записываем имя выбранной категории в заголовок страницы просмотра
  title.innerText = categoryName;

  // Берем данные из подключенного внешнего файла giftsData
  const gifts = giftsData[categoryKey];

  if (!gifts || gifts.length === 0) {
    container.innerHTML =
      '<p style="grid-column: 1/-1; text-align:center; color:#999;">Для этой категории идеи скоро добавятся!</p>';
  } else {
    // Рендерим все 13+ карточек
    gifts.forEach((gift) => {
      const card = document.createElement("div");
      let cardClass = "gift-card";
      if (gift.type === "retro") cardClass += " retro-card";
      if (gift.type === "modern") cardClass += " modern-card";

      card.className = cardClass;
      card.innerHTML = `
                <div>
                    <h4>${gift.title}</h4>
                    <p class="desc">${gift.desc}</p>
                </div>
                <div class="gift-info">
                    <p><strong>💰 Примерная цена:</strong> ${gift.price}</p>
                    <p><strong>📍 Где искать:</strong> ${gift.where}</p>
                </div>
            `;
      container.appendChild(card);
    });
  }

  // Скрываем главное меню с кнопками, открываем экран с подарками и кнопкой НАЗАД
  mainInterface.style.display = "none";
  viewInterface.style.display = "block";

  // Прокручиваем страницу наверх, чтобы просмотр шел с первой карточки
  window.scrollTo(0, 0);
}

// Функция для кнопки "Назад" — возвращает всё обратно
function goBack() {
  const mainInterface = document.getElementById("main-interface");
  const viewInterface = document.getElementById("view-interface");

  // Показываем главное меню со всеми фильтрами, скрываем экран просмотра
  mainInterface.style.display = "block";
  viewInterface.style.display = "none";
}
// Переключение вкладок "Возраст" и "Интересы" на главном экране
function switchTab(tabName) {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  document.getElementById("age-section").classList.remove("active");
  document.getElementById("interests-section").classList.remove("active");

  document.getElementById(`${tabName}-section`).classList.add("active");
}

// Главная магия: открываем категорию, прячем ВСЁ остальное
function filterGifts(categoryKey, categoryName) {
  const mainInterface = document.getElementById("main-interface");
  const viewInterface = document.getElementById("view-interface");
  const container = document.getElementById("gifts-container");
  const title = document.getElementById("current-category-title");

  // Очищаем контейнер карточек
  container.innerHTML = "";

  // Записываем имя выбранной категории в заголовок
  title.innerText = categoryName;

  const gifts = giftsData[categoryKey];

  if (!gifts || gifts.length === 0) {
    container.innerHTML =
      '<p style="grid-column: 1/-1; text-align:center; color:#999;">Для этой категории идеи скоро добавятся!</p>';
  } else {
    // Рендерим карточки
    gifts.forEach((gift) => {
      const card = document.createElement("div");
      let cardClass = "gift-card";
      if (gift.type === "retro") cardClass += " retro-card";
      if (gift.type === "modern") cardClass += " modern-card";

      card.className = cardClass;
      card.innerHTML = `
                <div>
                    <h4>${gift.title}</h4>
                    <p class="desc">${gift.desc}</p>
                </div>
                <div class="gift-info">
                    <p><strong>💰 Примерная цена:</strong> ${gift.price}</p>
                    <p><strong>📍 Где искать:</strong> ${gift.where}</p>
                </div>
            `;
      container.appendChild(card);
    });
  }

  // Скрываем главное меню и шапку, показываем только подарки
  mainInterface.style.display = "none";
  viewInterface.style.display = "block";

  // Прокручиваем страницу наверх, чтобы просмотр начинался с начала
  window.scrollTo(0, 0);
}

// Функция для кнопки "Назад" — возвращает всё обратно
function goBack() {
  const mainInterface = document.getElementById("main-interface");
  const viewInterface = document.getElementById("view-interface");

  // Показываем главное меню и шапку, скрываем экран просмотра
  mainInterface.style.display = "block";
  viewInterface.style.display = "none";
}
