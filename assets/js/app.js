/* -------------------------------------------------
   0. CONFIG
-------------------------------------------------- */
const API_ROOT = 'https://twoa-para-api.onrender.com';   // أو http://localhost:4000 للاختبار
const STORAGE_KEY = 'cartCount';

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------
     1. RESPONSIVE NAV (HAMBURGER)
  -------------------------------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const mainNav   = document.querySelector('.main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
    mainNav.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        hamburger.classList.remove('active');
      })
    );
  }

  /* -------------------------------------------------
     2. SCROLLED HEADER SHADOW
  -------------------------------------------------- */
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  /* -------------------------------------------------
     3. HERO SLIDER  (Ken-Burns + dots optional)
  -------------------------------------------------- */
  const slider = document.querySelector('.hero-slider');
  if (slider) {
    const slides   = slider.querySelectorAll('.slide');
    const nextBtn  = slider.querySelector('.next');
    const prevBtn  = slider.querySelector('.prev');
    const dotsWrap = slider.querySelector('.slide-dots'); // قد لا يكون موجودًا
    let i = 0, timer;

    const goTo = n => {
      slides[i].classList.remove('active');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('active');
      updateDots();
      resetTimer();
    };

    const resetTimer = () => {
      clearInterval(timer);
      timer = setInterval(() => goTo(i + 1), 6000);
    };

    const updateDots = () => {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('button').forEach((d, k) =>
        d.classList.toggle('active', k === i));
    };

    const createDots = () => {
      if (!dotsWrap) return;
      slides.forEach((_, k) => {
        const b = document.createElement('button');
        b.className = 'dot' + (k ? '' : ' active');
        b.onclick = () => goTo(k);
        dotsWrap.appendChild(b);
      });
    };

    nextBtn?.addEventListener('click', () => goTo(i + 1));
    prevBtn?.addEventListener('click', () => goTo(i - 1));

    createDots();
    resetTimer();
  }

  /* -------------------------------------------------
     4. MINI-CART BADGE
  -------------------------------------------------- */
  const cartIcon  = document.querySelector('[aria-label="Shopping Cart"]');
  let   cartCount = Number(localStorage.getItem(STORAGE_KEY)) || 0;

  if (cartIcon) {
    const badge = document.createElement('span');
    badge.className = 'cart-badge';
    badge.textContent = cartCount;
    badge.style.display = cartCount ? 'block' : 'none';
    cartIcon.appendChild(badge);

    function incrementCart() {
      cartCount++;
      badge.style.display = 'block';
      badge.textContent = cartCount;
      localStorage.setItem(STORAGE_KEY, cartCount);
    }

    /* delegation “Ajouter au Panier” */
    document.addEventListener('click', e => {
      const btn = e.target.closest('.add-cart');
      if (!btn) return;
      incrementCart();
      btn.textContent = 'Ajouté ✔';
      btn.disabled = true;
    });
  }

  /* -------------------------------------------------
     5. PRODUCTS + CATEGORY FILTER
  -------------------------------------------------- */
  const productGrid     = document.querySelector('.product-grid');
  const categoryBubbles = document.querySelectorAll('.cat-bubble');

  async function loadProducts(cat = '') {
    if (!productGrid) return;
    productGrid.innerHTML = '<p>Chargement…</p>';

    const url = cat
      ? `${API_ROOT}/api/products?category=${encodeURIComponent(cat)}`
      : `${API_ROOT}/api/products`;

    try {
      const res   = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      const items = await res.json();

      if (!items.length) {
        productGrid.innerHTML = '<p>Aucun produit trouvé.</p>';
        return;
      }

      productGrid.innerHTML = items.map(p => `
        <div class="product-card reveal">
          <div class="product-image">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
          </div>
          <div class="product-info">
            <span class="brand">${p.brand ?? ''}</span>
            <h3>${p.name}</h3>
            <div class="product-price">${p.price} MAD</div>
            <button class="btn btn-primary add-cart" data-id="${p._id}">Ajouter au Panier</button>
          </div>
        </div>
      `).join('');

      observeReveal();
    } catch (err) {
      console.error('fetch error', err);
      productGrid.innerHTML = '<p style="color:red">Erreur de chargement.</p>';
    }
  }

  categoryBubbles.forEach(b => {
    b.addEventListener('click', () => {
      categoryBubbles.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      loadProducts(b.dataset.cat);
    });
  });

  /* فقاعة “Tous” = data-cat="all" (أو اترك cat فارغ) */
  document.querySelector('.cat-bubble[data-cat="all"]')?.classList.add('active');
  loadProducts();   // أول تحميل

  /* -------------------------------------------------
     6. SCROLL-REVEAL
  -------------------------------------------------- */
  function observeReveal() {
    const els = document.querySelectorAll('.reveal:not(.visible)');
    const io  = new IntersectionObserver((e, obs) => {
      e.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add('visible');
          obs.unobserve(ent.target);
        }
      });
    }, {threshold:0.15});
    els.forEach(el => io.observe(el));
  }
  observeReveal();
});
