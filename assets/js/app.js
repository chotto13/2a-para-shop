/* -------------------------------------------------
   0. CONFIG
-------------------------------------------------- */
const API_ROOT = 'https://twoa-para-api.onrender.com'; // ← رابط خادمك
const STORAGE_KEY = 'cartCount';

/* -------------------------------------------------
   1. RESPONSIVE NAV (hamburger)
-------------------------------------------------- */
const hamburger = document.querySelector('.hamburger');
const mainNav   = document.querySelector('.main-nav');

hamburger.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  hamburger.classList.toggle('active');
});

mainNav.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => mainNav.classList.remove('open'))
);

/* -------------------------------------------------
   2. SMOOTH SCROLL FROM HERO → PRODUCTS
-------------------------------------------------- */
const heroBtn    = document.querySelector('.hero .btn-primary');
const productsEl = document.getElementById('products');

heroBtn?.addEventListener('click', e => {
  e.preventDefault();
  productsEl.scrollIntoView({ behavior: 'smooth' });
});

/* -------------------------------------------------
   3. MINI-CART BADGE (localStorage)
-------------------------------------------------- */
const cartIcon = document.querySelector('[aria-label="Shopping Cart"]');
let cartCount  = Number(localStorage.getItem(STORAGE_KEY)) || 0;

const badge = document.createElement('span');
badge.className   = 'cart-badge';
badge.textContent = cartCount;
cartIcon.appendChild(badge);

function incrementCart() {
  cartCount++;
  localStorage.setItem(STORAGE_KEY, cartCount);
  badge.textContent = cartCount;
}

/* -------------------------------------------------
   4. LOAD PRODUCTS FROM API & RENDER GRID
-------------------------------------------------- */
async function loadProducts() {
  const grid = document.querySelector('.product-grid');
  grid.innerHTML = '<p>Chargement…</p>';

  try {
    const res   = await fetch(`${API_ROOT}/api/products`);
    const items = await res.json();

    if (!Array.isArray(items) || !items.length) {
      grid.innerHTML = '<p>Aucun produit pour le moment.</p>';
      return;
    }

    grid.innerHTML = items
      .map(
        p => `
      <div class="product-card">
        <div class="product-image">
          <img src="${p.image}" alt="${p.name}" />
        </div>
        <div class="product-info">
          <span class="brand">${p.brand ?? ''}</span>
          <h3>${p.name}</h3>
          <div class="product-price">${p.price} MAD</div>
          <button type="button"
                  class="btn btn-primary add-cart"
                  data-id="${p._id}">
            Ajouter au Panier
          </button>
        </div>
      </div>`
      )
      .join('');
  } catch (err) {
    console.error(err);
    grid.innerHTML =
      '<p style="color:red">Erreur de chargement des produits.</p>';
  }
}

/* -------------------------------------------------
   5. EVENT DELEGATION  →  “Ajouter au Panier”
-------------------------------------------------- */
document.addEventListener('click', e => {
  const btn = e.target.closest('.add-cart');
  if (!btn) return;

  incrementCart();
  btn.textContent = 'Ajouté ✔';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Ajouter au Panier';
    btn.disabled = false;
  }, 1500);
});

/* -------------------------------------------------
   6. INIT
-------------------------------------------------- */
document.addEventListener('DOMContentLoaded', loadProducts);
/* ---------- Simple slider ---------- */
const slides = document.querySelectorAll('.hero-slider .slide');
let idx = 0;
document.querySelector('.slide-btn.next')?.addEventListener('click', () => changeSlide(1));
document.querySelector('.slide-btn.prev')?.addEventListener('click', () => changeSlide(-1));

function changeSlide(dir){
  slides[idx].classList.remove('active');
  idx = (idx + dir + slides.length) % slides.length;
  slides[idx].classList.add('active');
}
setInterval(()=>changeSlide(1), 6000);  // auto-play كل 6 ثوان
