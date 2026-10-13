// NEXTALAB storefront configuration
// Replace this with your Telegram username (without the @), e.g. "nextalabshop".
const TELEGRAM_USERNAME = "YOUR_TELEGRAM_USERNAME";

const products = [
  {
    id: "m3pro",
    name: "Smailwolf M3 Pro",
    category: "mice",
    categoryLabel: "Wireless mouse",
    tag: "Popular",
    description: "Tri-mode connectivity for a clean, flexible setup.",
    price: "Ask for price",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=85",
    alt: "Minimal black computer mouse"
  },
  {
    id: "k61",
    name: "PGPN K61",
    category: "keyboards",
    categoryLabel: "60% keyboard",
    tag: "Compact",
    description: "A compact mechanical-style board for smaller desks.",
    price: "Ask for price",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=85",
    alt: "Compact keyboard on a desk"
  },
  {
    id: "mousepad",
    name: "Extended Desk Mat",
    category: "desk",
    categoryLabel: "Desk accessory",
    tag: "Desk essential",
    description: "More room for your mouse and a tidier-looking setup.",
    price: "From $4.99",
    image: "https://images.unsplash.com/photo-1615750185825-fc7b4a2f6b72?auto=format&fit=crop&w=800&q=85",
    alt: "Minimal desk mat"
  },
  {
    id: "coiled-cable",
    name: "Coiled USB-C Cable",
    category: "desk",
    categoryLabel: "Cable",
    tag: "Finishing touch",
    description: "A coiled cable to add a little character to your desk.",
    price: "Ask for price",
    image: "https://images.unsplash.com/photo-1612444530582-fc66183b16f4?auto=format&fit=crop&w=800&q=85",
    alt: "Computer cable accessory"
  }
];

function telegramUrl(productName) {
  const username = TELEGRAM_USERNAME.trim().replace(/^@/, "");
  const message = encodeURIComponent(`Hi NEXTALAB! I'm interested in the ${productName}. Could you confirm the price and availability?`);
  if (!username || username === "YOUR_TELEGRAM_USERNAME") {
    return `https://t.me/share/url?url=${encodeURIComponent("NEXTALAB")}&text=${message}`;
  }
  return `https://t.me/${username}?text=${message}`;
}

function renderProducts(filter = "all") {
  const grid = document.querySelector("#product-grid");
  const visibleProducts = products.filter(product => filter === "all" || product.category === filter);
  grid.innerHTML = visibleProducts.map(product => `
    <article class="product-card">
      <div class="product-art">
        <img src="${product.image}" alt="${product.alt}" loading="lazy">
        <span class="product-tag">${product.tag}</span>
        <a class="quick-order" href="${telegramUrl(product.name)}" target="_blank" rel="noopener">Ask about this item ↗</a>
      </div>
      <div class="product-info">
        <span class="product-category">${product.categoryLabel}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom"><span class="product-price">${product.price}</span><a href="${telegramUrl(product.name)}" target="_blank" rel="noopener">Order ↗</a></div>
      </div>
    </article>`).join("");
}

document.querySelectorAll(".filter-chip").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.remove("active"));
    button.classList.add("active");
    renderProducts(button.dataset.filter);
  });
});

document.querySelectorAll(".telegram-link").forEach(link => {
  link.href = telegramUrl("gaming accessories");
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".desktop-nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

document.querySelector("#year").textContent = new Date().getFullYear();
renderProducts();
