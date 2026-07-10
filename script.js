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
// Хранилище для отзывов и оценок
const userInteractions = {};
let currentCategoryKey = "";
let currentCategoryName = "";

function switchTab(tabName) {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  document.getElementById("age-section").classList.remove("active");
  document.getElementById("interests-section").classList.remove("active");
  document.getElementById(`${tabName}-section`).classList.add("active");
}

// Показ списка подарков в категории
function filterGifts(categoryKey, categoryName) {
  currentCategoryKey = categoryKey;
  currentCategoryName = categoryName;

  const mainInterface = document.getElementById("main-interface");
  const viewInterface = document.getElementById("view-interface");
  const detailInterface = document.getElementById("detail-interface");
  const container = document.getElementById("gifts-container");
  const title = document.getElementById("current-category-title");

  container.innerHTML = "";
  title.innerText = categoryName;

  const gifts = giftsData[categoryKey];

  if (!gifts || gifts.length === 0) {
    container.innerHTML =
      '<p style="grid-column: 1/-1; text-align:center; color:#999;">Идеи скоро добавятся!</p>';
  } else {
    gifts.forEach((gift, index) => {
      const giftId = `${categoryKey}-${index}`;

      if (!userInteractions[giftId]) {
        userInteractions[giftId] = { rating: 0, comments: [] };
      }

      const card = document.createElement("div");
      let cardClass = "gift-card";
      if (gift.type === "retro") cardClass += " retro-card";
      if (gift.type === "modern") cardClass += " modern-card";
      card.className = cardClass;

      // Клик по карточке открывает ОТДЕЛЬНЫЙ экран подарка
      card.onclick = () => openGiftDetail(categoryKey, index);

      card.innerHTML = `
        <div class="gift-image-wrapper">
          <img class="gift-image" src="https://picsum.photos/seed/${index + gift.title.length}/400/250" alt="${gift.title}">
        </div>
        <div class="gift-card-content">
          <h4>${gift.title}</h4>
          <p class="desc">${gift.desc.substring(0, 70)}...</p>
          <div class="card-footer-info">
            <span class="price-tag">${gift.price.split("-")[0]}</span>
            <span class="click-prompt">Открыть подарок →</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  mainInterface.style.display = "none";
  viewInterface.style.display = "block";
  detailInterface.style.display = "none";
  window.scrollTo(0, 0);
}

// Открытие отдельного экрана конкретного подарка
function openGiftDetail(categoryKey, index) {
  const giftId = `${categoryKey}-${index}`;
  const gift = giftsData[categoryKey][index];

  document.getElementById("main-interface").style.display = "none";
  document.getElementById("view-interface").style.display = "none";
  const detailInterface = document.getElementById("detail-interface");
  detailInterface.style.display = "block";

  document.getElementById("detail-gift-title").innerText = gift.title;

  const contentContainer = document.getElementById("gift-detail-content");
  contentContainer.innerHTML = `
    <div class="detail-layout">
      <div class="detail-left">
        <img class="detail-image" src="https://picsum.photos/seed/${index + gift.title.length}/600/400" alt="${gift.title}">
        <p class="detail-desc">${gift.desc}</p>
        <div class="detail-info-block">
          <p><strong>💰 Примерная цена:</strong> ${gift.price}</p>
          <p><strong>📍 Где искать:</strong> ${gift.where}</p>
        </div>
      </div>
      
      <div class="detail-right">
        <div class="rating-section">
          <span class="rating-label">Оцените подарок:</span>
          <div class="stars" data-gift-id="${giftId}">
            ${[1, 2, 3, 4, 5]
              .map(
                (num) => `
              <span class="star ${userInteractions[giftId].rating >= num ? "selected" : ""}" data-value="${num}">★</span>
            `,
              )
              .join("")}
          </div>
          <button class="reset-rating-btn" onclick="resetRating('${giftId}')" title="Сбросить звезды">✕ Сбросить оценку</button>
        </div>

        <div class="comments-section">
          <h5>Отзывы пользователей:</h5>
          <div class="comments-list" id="detail-comments-list-${giftId}">
            ${
              userInteractions[giftId].comments.length === 0
                ? '<p class="no-comments">Отзывов пока нет. Оставьте свой комментарий первым!</p>'
                : userInteractions[giftId].comments
                    .map(
                      (c) => `
                <div class="comment-item">
                  <div class="comment-stars">${"★".repeat(c.stars)}${"☆".repeat(5 - c.stars)}</div>
                  <div class="comment-text">${c.text}</div>
                </div>
              `,
                    )
                    .join("")
            }
          </div>
          <div class="comment-input-group">
            <input type="text" id="detail-input-${giftId}" placeholder="Напишите ваше мнение о подарке...">
            <button onclick="addDetailComment('${giftId}')">Отправить</button>
          </div>
        </div>
      </div>
    </div>
  `;

  setupStarsEvents(giftId);
  window.scrollTo(0, 0);
}

// Настройка плавных ховеров и кликов для звезд
function setupStarsEvents(giftId) {
  const container = document.querySelector(`.stars[data-gift-id="${giftId}"]`);
  if (!container) return;
  const stars = container.querySelectorAll(".star");

  stars.forEach((star) => {
    star.addEventListener("mouseover", () => {
      const currentVal = parseInt(star.getAttribute("data-value"));
      stars.forEach((s) => {
        if (parseInt(s.getAttribute("data-value")) <= currentVal)
          s.classList.add("hover");
        else s.classList.remove("hover");
      });
    });

    star.addEventListener("mouseout", () => {
      stars.forEach((s) => s.classList.remove("hover"));
    });

    star.addEventListener("click", () => {
      const value = parseInt(star.getAttribute("data-value"));
      userInteractions[giftId].rating = value;
      stars.forEach((s) => {
        if (parseInt(s.getAttribute("data-value")) <= value)
          s.classList.add("selected");
        else s.classList.remove("selected");
      });
    });
  });
}

// Функция мгновенного сброса звезд
function resetRating(giftId) {
  userInteractions[giftId].rating = 0;
  const container = document.querySelector(`.stars[data-gift-id="${giftId}"]`);
  if (container) {
    container.querySelectorAll(".star").forEach((s) => {
      s.classList.remove("selected");
      s.classList.remove("hover");
    });
  }
}

// Добавление комментария с фиксацией текущих звезд
function addDetailComment(giftId) {
  const input = document.getElementById(`detail-input-${giftId}`);
  const text = input.value.trim();
  if (!text) return;

  // Берем текущее количество звезд, выбранное пользователем
  const currentStars = userInteractions[giftId].rating;

  // Сохраняем и текст, и звезды в объект
  userInteractions[giftId].comments.push({
    text: text,
    stars: currentStars,
  });

  input.value = "";

  // Обновляем список комментариев на экране
  const list = document.getElementById(`detail-comments-list-${giftId}`);
  list.innerHTML = userInteractions[giftId].comments
    .map(
      (c) => `
    <div class="comment-item">
      <div class="comment-stars">${"★".repeat(c.stars)}${"☆".repeat(5 - c.stars)}</div>
      <div class="comment-text">${c.text}</div>
    </div>
  `,
    )
    .join("");
}

// Кнопка НАЗАД с экрана одного подарка к списку подарков категории
function goBackToGifts() {
  document.getElementById("main-interface").style.display = "none";
  document.getElementById("view-interface").style.display = "block";
  document.getElementById("detail-interface").style.display = "none";
}

// Кнопка НАЗАД со списка подарков к главным категориям
function goBackToCategories() {
  document.getElementById("main-interface").style.display = "block";
  document.getElementById("view-interface").style.display = "none";
  document.getElementById("detail-interface").style.display = "none";
}
