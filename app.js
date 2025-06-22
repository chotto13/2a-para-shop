document.addEventListener('DOMContentLoaded', () => {

    /* -----------------------------
     * 1. MOBILE NAVIGATION TOGGLE
     * -----------------------------*/
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            // Optional: Toggle icon between bars and an 'X'
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu when a link inside it is clicked
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    /* -----------------------------
     * 2. SMOOTH SCROLL FOR HERO BUTTON
     * -----------------------------*/
    const heroBtn = document.querySelector('.hero .btn-primary');
    const productsEl = document.getElementById('products');

    if (heroBtn && productsEl) {
        heroBtn.addEventListener('click', e => {
            e.preventDefault(); // Stop the default anchor jump
            productsEl.scrollIntoView({ behavior: 'smooth' });
        });
    }

    /* -----------------------------
     * 3. MINI CART COUNTER LOGIC
     * -----------------------------*/
    const cartIcon = document.querySelector('[aria-label="Shopping Cart"]');
    
    if (cartIcon) {
        // Retrieve count from localStorage or default to 0
        let cartCount = Number(localStorage.getItem('cartCount')) || 0;

        // Create and append the badge element to the cart icon
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = cartCount;
        cartIcon.appendChild(badge);

        // Find all "Add to Cart" buttons
        const addToCartButtons = document.querySelectorAll('.product-card .btn-primary');

        addToCartButtons.forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault(); // Stop the link's default behavior

                // Increment count and update storage/display
                cartCount++;
                localStorage.setItem('cartCount', cartCount);
                badge.textContent = cartCount;

                // Provide visual feedback on the button
                btn.textContent = 'Ajouté ✔';
                
                // Set the button back to its original state after a delay
                setTimeout(() => {
                    btn.textContent = 'Ajouter au Panier';
                }, 1500); 
            });
        });
    }

});
