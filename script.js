// LocalStorage data loading
const userInteractions =
  JSON.parse(localStorage.getItem("gift_reviews_data")) || {};
let cart = JSON.parse(localStorage.getItem("gift_cart_data")) || [];

let currentCategoryKey = "";
let currentCategoryName = "";

document.addEventListener("DOMContentLoaded", () => {
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

function showDetail(categoryKey, giftTitle) {
  const gifts = giftsData[categoryKey];
  const gift = gifts.find((g) => g.title === giftTitle);
  if (!gift) return;

  const detailInterface = document.getElementById("detail-interface");
  const mainInterface = document.getElementById("main-interface");
  const viewInterface = document.getElementById("view-interface");
  const container = document.getElementById("detail-content-container");

  const giftId = encodeURIComponent(gift.title);
  if (!userInteractions[giftId]) {
    userInteractions[giftId] = { rating: 5, comments: [] };
  }

  const interactions = userInteractions[giftId];
  const starRatingHtml = [1, 2, 3, 4, 5]
    .map(
      (num) =>
        `<span class="star-clickable ${num <= interactions.rating ? "selected" : ""}" onclick="setDetailRating('${giftId}', ${num})">★</span>`,
    )
    .join("");

  const initialCommentsHtml = interactions.comments
    .map(
      (c) => `
      <div class="comment-item">
        <div class="comment-stars">${"★".repeat(c.stars)}${"☆".repeat(5 - c.stars)}</div>
        <div class="comment-text">${c.text}</div>
      </div>
    `,
    )
    .join("");

  container.innerHTML = `
    <div class="detail-layout">
      <div class="detail-left-side">
        ${gift.image ? `<img src="${gift.image}" alt="${gift.title}" class="detail-main-img">` : ""}
        <div class="detail-description-block">
          <h3>Description</h3>
          <p class="detail-full-desc">${gift.desc}</p>
        </div>
      </div>

      <div class="detail-right-side">
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
        <h3>User Reviews & Feedbacks</h3>
        
        <div class="leave-review-box">
          <h4>Leave your feedback:</h4>
          <div class="rating-input-row">
            <span class="rating-label">Your Rating:</span>
            <div id="detail-stars-row-${giftId}" class="stars-row">${starRatingHtml}</div>
          </div>
          <div class="comment-input-group">
            <input type="text" id="detail-input-${giftId}" placeholder="Write your review here...">
            <button onclick="addDetailComment('${giftId}')">Submit Review</button>
          </div>
        </div>

        <div id="detail-comments-list-${giftId}" class="comments-list">
          ${initialCommentsHtml || '<p class="no-reviews">No reviews yet. Be the first to leave one!</p>'}
        </div>
      </div>
    </div>
  `;

  mainInterface.style.display = "none";
  viewInterface.style.display = "none";
  detailInterface.style.display = "block";
  window.scrollTo(0, 0);
}

function setDetailRating(giftId, ratingValue) {
  userInteractions[giftId].rating = ratingValue;
  saveToStorage();

  const starsRow = document.getElementById(`detail-stars-row-${giftId}`);
  if (starsRow) {
    const stars = starsRow.querySelectorAll(".star-clickable");
    stars.forEach((star, index) => {
      if (index < ratingValue) {
        star.classList.add("selected");
      } else {
        star.classList.remove("selected");
      }
    });
  }
}

function addDetailComment(giftId) {
  const input = document.getElementById(`detail-input-${giftId}`);
  const text = input.value.trim();
  if (!text) return;

  const currentStars = userInteractions[giftId].rating;

  userInteractions[giftId].comments.push({
    text: text,
    stars: currentStars,
  });

  saveToStorage();
  input.value = "";

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

function saveToStorage() {
  localStorage.setItem("gift_reviews_data", JSON.stringify(userInteractions));
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

/* --- SHOPPING CART SYSTEM --- */
function addToCart(title, price, image) {
  event.stopPropagation(); // Stop navigation trigger
  cart.push({ title, price, image });
  localStorage.setItem("gift_cart_data", JSON.stringify(cart));
  updateCartCount();
  alert(`"${title}" has been added to your cart!`);
}

function updateCartCount() {
  document.getElementById("cart-count").innerText = cart.length;
}

function toggleCart() {
  const modal = document.getElementById("cart-modal");
  if (modal.style.display === "none" || modal.style.display === "") {
    renderCartItems();
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

function removeCartItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("gift_cart_data", JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}
