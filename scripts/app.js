console.log("E-commerce Website Loaded");

document.addEventListener("DOMContentLoaded", () => {

    // --- MOBILE MENU TOGGLE ---
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

    // --- CART SETUP ---
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productGrid = document.getElementById("productGrid");
    const cartCount = document.querySelector(".cart-count");

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    updateCartCount();

    // --- LOADING MESSAGE ---
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Loading products...';
    loadingMessage.style.textAlign = 'center';
    loadingMessage.style.fontSize = '1.2em';
    productGrid.appendChild(loadingMessage);

    // --- CREATE PRODUCT CARD ---
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            <h3>${product.title}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="description">${product.description.slice(0, 60)}...</p>
            <button class="add-to-cart"
                data-id="${product.id}"
                data-title="${product.title}"
                data-price="${product.price}"
                data-image="${product.image}">
                Add to Cart
            </button>
        `;
        return card;
    }

    // --- DISPLAY PRODUCTS ---
    function displayProducts(products) {
        productGrid.innerHTML = ''; // Clear loading / static cards
        products.forEach(product => {
            const card = createProductCard(product);
            productGrid.appendChild(card);
        });
    }

    // --- FETCH PRODUCTS FROM API ---
    const apiURL = 'https://fakestoreapi.com/products';

    async function fetchProducts() {
        try {
            // Check cache
            let products = JSON.parse(localStorage.getItem('products'));
            if (!products) {
                const response = await fetch(apiURL);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                products = await response.json();
                localStorage.setItem('products', JSON.stringify(products));
                console.log('Products fetched successfully from API');
            } else {
                console.log('Loaded products from cache');
            }

            displayProducts(products);

        } catch (error) {
            console.error('Error loading products:', error);
            loadingMessage.textContent = 'Failed to load products. Please try again later.';
            loadingMessage.style.color = 'red';
        }
    }

    // --- ADD TO CART (EVENT DELEGATION) ---
    document.addEventListener("click", (e) => {
        if (!e.target.classList.contains("add-to-cart")) return;

        const btn = e.target;
        const product = {
            id: btn.dataset.id,
            title: btn.dataset.title,
            price: Number(btn.dataset.price),
            image: btn.dataset.image,
            quantity: 1
        };

        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push(product);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    });

    // --- INIT ---
    fetchProducts();
});
