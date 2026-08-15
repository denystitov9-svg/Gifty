// ======= НАСТРОЙКА СЕРВЕРА =======
// Укажите здесь адрес вашего backend-сервера (см. папку /server).
// Для локальной разработки — http://localhost:3001
// После деплоя на Render замените на реальный URL вашего сервиса,
// например: https://giftguide-api.onrender.com
// const API_BASE_URL = "http://localhost:3000";
const API_BASE_URL = "https://gifty-backend-1tmt.onrender.com/";
// Анонимный ID устройства — НЕ регистрация. Создаётся один раз в браузере
// и используется только для того, чтобы сервер понимал, чья это корзина.
function getDeviceId() {
  let id = localStorage.getItem("gift_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("gift_device_id", id);
  }
  return id;
}
const DEVICE_ID = getDeviceId();

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Device-Id": DEVICE_ID,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

let cart = [];

let currentCategoryKey = "";
let currentCategoryName = "";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    cart = await apiRequest("/api/cart");
  } catch (err) {
    console.error("Could not load cart from server:", err);
    cart = [];
  }
  updateCartCount();
});

function switchTab(tabName) {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  if (event) event.target.classList.add("active");

  document.getElementById("age-section").classList.remove("active");
  document.getElementById("interests-section").classList.remove("active");
  document.getElementById(`${tabName}-section`).classList.add("active");
}

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
      '<p style="grid-column: 1/-1; text-align:center; color:#999;">Ideas for this category will be added soon!</p>';
  } else {
    gifts.forEach((gift) => {
      const card = document.createElement("div");
      let cardClass = "gift-card";
      if (gift.type === "retro") cardClass += " retro-card";
      if (gift.type === "modern") cardClass += " modern-card";

      card.className = cardClass;
      card.innerHTML = `
        <div onclick="showDetail('${categoryKey}', '${gift.title}')" style="cursor:pointer;">
          ${gift.image ? `<img src="${gift.image}" alt="${gift.title}" class="gift-card-img">` : ""}
          <h4>${gift.title}</h4>
          <p class="desc">${gift.desc}</p>
        </div>
        <div class="gift-info">
          <p><strong>💰 Est. Price:</strong> ${gift.price}</p>
          <p><strong>📍 Where to find:</strong> ${gift.where}</p>
          <button class="add-to-cart-btn" onclick="addToCart('${gift.title}', '${gift.price}', '${gift.image || ""}')">Add to Cart</button>
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

async function showDetail(categoryKey, giftTitle) {
  const gifts = giftsData[categoryKey];
  const gift = gifts.find((g) => g.title === giftTitle);
  if (!gift) return;

  const detailInterface = document.getElementById("detail-interface");
  const mainInterface = document.getElementById("main-interface");
  const viewInterface = document.getElementById("view-interface");
  const container = document.getElementById("detail-content-container");

  const giftId = encodeURIComponent(gift.title);

  container.innerHTML = `
    <div class="detail-layout">
      <div class="detail-left-side">
        ${gift.image ? `<img src="${gift.image}" alt="${gift.title}" class="detail-main-img">` : ""}
      </div>

      <div class="detail-right-side">
        <div class="detail-description-block">
          <h3>Description</h3>
          <p class="detail-full-desc">${gift.desc}</p>
        </div>
        <div class="sticky-info-panel">
          <div class="panel-row"><strong>💰 Price Range:</strong> <span>${gift.price}</span></div>
          <div class="panel-row"><strong>📍 Available At:</strong> <span>${gift.where}</span></div>
          <button class="add-to-cart-btn wide-btn" onclick="addToCart('${gift.title}', '${gift.price}', '${gift.image || ""}')">⚡ Add to Shopping Cart</button>
        </div>
      </div>
    </div>

    <div class="detail-bottom-side">
      <hr class="separator">
      <div class="reviews-section">
        <h3>User Reviews & Feedbacks <span id="avg-rating-${giftId}"></span></h3>

        <div class="leave-review-box">
          <h4>Leave your feedback:</h4>
          <div class="rating-input-row">
            <span class="rating-label">Your Rating:</span>
            <div id="detail-stars-row-${giftId}" class="stars-row"></div>
          </div>
          <div class="comment-input-group">
            <input type="text" id="detail-input-${giftId}" placeholder="Write your review">
            <button onclick="addDetailComment('${giftId}')">Submit Review</button>
          </div>
        </div>

        <div id="detail-comments-list-${giftId}" class="comments-list">
          <p class="no-reviews">Loading reviews…</p>
        </div>
      </div>
    </div>
  `;

  // Локальное (ещё не отправленное) значение рейтинга для формы отзыва
  window.pendingRating = window.pendingRating || {};
  window.pendingRating[giftId] = 5;
  renderStarInput(giftId);

  mainInterface.style.display = "none";
  viewInterface.style.display = "none";
  detailInterface.style.display = "block";
  window.scrollTo(0, 0);

  try {
    const data = await apiRequest(`/api/reviews/${giftId}`);
    renderReviews(giftId, data);
  } catch (err) {
    console.error("Could not load reviews:", err);
    const list = document.getElementById(`detail-comments-list-${giftId}`);
    if (list)
      list.innerHTML =
        '<p class="no-reviews">Could not load reviews right now.</p>';
  }
}

function renderStarInput(giftId) {
  const row = document.getElementById(`detail-stars-row-${giftId}`);
  if (!row) return;
  const current = window.pendingRating[giftId] || 5;
  row.innerHTML = [1, 2, 3, 4, 5]
    .map(
      (num) =>
        `<span class="star-clickable ${num <= current ? "selected" : ""}" onclick="setDetailRating('${giftId}', ${num})">★</span>`,
    )
    .join("");
}

function renderReviews(giftId, data) {
  const avgEl = document.getElementById(`avg-rating-${giftId}`);
  if (avgEl) {
    avgEl.textContent = data.comments.length
      ? `— ${"★".repeat(Math.round(data.average))}${"☆".repeat(5 - Math.round(data.average))} (${data.average} avg, ${data.comments.length} review${data.comments.length === 1 ? "" : "s"})`
      : "";
  }

  const list = document.getElementById(`detail-comments-list-${giftId}`);
  if (!list) return;
  list.innerHTML =
    data.comments
      .map(
        (c) => `
      <div class="comment-item">
        <div class="comment-stars">${"★".repeat(c.stars)}${"☆".repeat(5 - c.stars)}</div>
        <div class="comment-text">${c.text}</div>
      </div>
    `,
      )
      .join("") ||
    '<p class="no-reviews">No reviews yet. Be the first to leave one!</p>';
}

function setDetailRating(giftId, ratingValue) {
  window.pendingRating[giftId] = ratingValue;
  renderStarInput(giftId);
}

async function addDetailComment(giftId) {
  const input = document.getElementById(`detail-input-${giftId}`);
  const text = input.value.trim();
  if (!text) return;

  const stars = window.pendingRating[giftId] || 5;

  try {
    const data = await apiRequest(`/api/reviews/${giftId}`, {
      method: "POST",
      body: JSON.stringify({ text, stars }),
    });
    input.value = "";
    renderReviews(giftId, data);
  } catch (err) {
    console.error("Could not submit review:", err);
    alert("Sorry, your review could not be submitted. Please try again.");
  }
}

function goBackToGifts() {
  document.getElementById("main-interface").style.display = "none";
  document.getElementById("view-interface").style.display = "block";
  document.getElementById("detail-interface").style.display = "none";
  window.scrollTo(0, 0);
}

function goBackToCategories() {
  document.getElementById("main-interface").style.display = "block";
  document.getElementById("view-interface").style.display = "none";
  document.getElementById("detail-interface").style.display = "none";
  window.scrollTo(0, 0);
}

/* --- SHOPPING CART SYSTEM (хранится на сервере / MongoDB) --- */
async function addToCart(title, price, image) {
  event.stopPropagation(); // Stop navigation trigger
  try {
    cart = await apiRequest("/api/cart", {
      method: "POST",
      body: JSON.stringify({ title, price, image }),
    });
    updateCartCount();
    alert(`"${title}" has been added to your cart!`);
  } catch (err) {
    console.error("Could not add to cart:", err);
    alert("Sorry, could not add this item to your cart. Please try again.");
  }
}

// На странице есть два счётчика корзины: в главном хедере (#cart-count)
// и в хедере детальной страницы (#cart-count-detail). Обновляем оба сразу.
function updateCartCount() {
  const count = String(cart.length);
  const main = document.getElementById("cart-count");
  const detail = document.getElementById("cart-count-detail");
  if (main) main.innerText = count;
  if (detail) detail.innerText = count;
}

async function toggleCart() {
  const modal = document.getElementById("cart-modal");
  if (modal.style.display === "none" || modal.style.display === "") {
    try {
      cart = await apiRequest("/api/cart");
    } catch (err) {
      console.error("Could not refresh cart:", err);
    }
    renderCartItems();
    updateCartCount();
    modal.style.display = "flex";
  } else {
    modal.style.display = "none";
  }
}

function renderCartItems() {
  const list = document.getElementById("cart-items-list");
  const totalContainer = document.getElementById("cart-total-price");
  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML =
      '<p class="empty-cart-msg">Your shopping cart is currently empty.</p>';
    totalContainer.innerText = "$0";
    return;
  }

  let calculatedTotal = 0;

  cart.forEach((item, index) => {
    // Parse single or average price value for accumulation
    const priceDigits = item.price.replace(/[^0-9.-]+/g, "").split("-");
    let numericalPrice = 0;
    if (priceDigits.length > 0 && priceDigits[0]) {
      numericalPrice = parseFloat(priceDigits[0]);
    }
    calculatedTotal += numericalPrice;

    const div = document.createElement("div");
    div.className = "cart-item-row";
    div.innerHTML = `
      <div class="cart-item-left">
        ${item.image ? `<img src="${item.image}" alt="${item.title}">` : '<div class="no-img-placeholder">🎁</div>'}
        <div>
          <h4>${item.title}</h4>
          <span class="cart-item-price">${item.price}</span>
        </div>
      </div>
      <button class="remove-cart-item-btn" onclick="removeCartItem(${index})">Remove</button>
    `;
    list.appendChild(div);
  });

  totalContainer.innerText = `$${calculatedTotal.toLocaleString()}+`;
}

async function removeCartItem(index) {
  try {
    cart = await apiRequest(`/api/cart/${index}`, { method: "DELETE" });
    updateCartCount();
    renderCartItems();
  } catch (err) {
    console.error("Could not remove item:", err);
    alert("Sorry, could not remove this item. Please try again.");
  }
}
