/* ========== CONFIG ====================== */
const API_ROOT = 'https://twoa-para-api.onrender.com';
const STORAGE_KEY = 'cartCount';

/* ========== MOBILE NAV ================== */
const hamburger = document.querySelector('.hamburger');
const mainNav   = document.querySelector('.main-nav');

hamburger?.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  hamburger.classList.toggle('active');
});
mainNav?.querySelectorAll('a').forEach(l =>
  l.addEventListener('click', () => mainNav.classList.remove('open'))
);

/* ========== HERO SLIDER ================= */
const slides = document.querySelectorAll('.hero-slider .slide');
let sIdx = 0;
document.querySelector('.slide-btn.next')?.addEventListener('click', ()=>changeSlide(1));
document.querySelector('.slide-btn.prev')?.addEventListener('click', ()=>changeSlide(-1));
setInterval(()=>changeSlide(1), 6000);

function changeSlide(dir){
  slides[sIdx].classList.remove('active');
  sIdx = (sIdx + dir + slides.length) % slides.length;
  slides[sIdx].classList.add('active');
}

/* ========== CART BADGE ================== */
const cartIcon = document.querySelector('[aria-label="Shopping Cart"]');
let cartCount  = Number(localStorage.getItem(STORAGE_KEY)) || 0;

const badge = document.createElement('span');
badge.className = 'cart-badge';
badge.textContent = cartCount;
cartIcon.appendChild(badge);
function incCart(){
  cartCount++;
  localStorage.setItem(STORAGE_KEY, cartCount);
  badge.textContent = cartCount;
}

/* ========== LOAD PRODUCTS =============== */
async function loadProducts(cat=null){
  const grid = document.querySelector('.product-grid');
  grid.innerHTML = 'Chargement…';
  const url = cat ? `${API_ROOT}/api/products?category=${cat}` : `${API_ROOT}/api/products`;
  try{
    const res  = await fetch(url);
    const data = await res.json();
    if(!data.length){ grid.innerHTML='Aucun produit.'; return; }

    grid.innerHTML = data.map(p=>`
      <div class="product-card">
        <div class="product-image"><img src="${p.image}" alt="${p.name}"></div>
        <div class="product-info">
          <span class="brand">${p.brand}</span>
          <h3>${p.name}</h3>
          <div class="product-price">${p.price} MAD</div>
          <button class="btn btn-primary add-cart">Ajouter au Panier</button>
        </div>
      </div>
    `).join('');
  }catch(err){
    grid.innerHTML='<p style="color:red">Erreur de chargement.</p>';
    console.error(err);
  }
}
document.addEventListener('DOMContentLoaded',()=>loadProducts());

/* ========== ADD-TO-CART HANDLER ========= */
document.addEventListener('click', e=>{
  const btn = e.target.closest('.add-cart');
  if(!btn) return;
  incCart();
  btn.textContent='Ajouté ✔'; btn.disabled=true;
  setTimeout(()=>{btn.textContent='Ajouter au Panier'; btn.disabled=false;},1500);
});

/* ========== CATEGORY FILTER ============ */
document.querySelectorAll('.cat-bubble').forEach(b=>{
  b.addEventListener('click', ()=>{
    loadProducts(b.dataset.cat);
    document.getElementById('products').scrollIntoView({behavior:'smooth'});
  });
});
