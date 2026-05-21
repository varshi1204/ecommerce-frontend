/* =========================
   GLOBAL STATE
========================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

console.log("🛒 E-commerce App Loaded");

/* =========================
   UTILITIES
========================= */

function saveCart() {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  } catch (err) {
    console.error("Cart save failed:", err);
  }
}

function updateCartCount() {
  const cartCount = document.querySelector(".cart-count");

  if (!cartCount) return;

  const totalQty = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  cartCount.textContent = totalQty;
}

/* =========================
   DOM READY
========================= */

document.addEventListener("DOMContentLoaded", () => {

  updateCartCount();

  /* =========================
     HAMBURGER MENU
  ========================= */

  const hamburger = document.getElementById("hamburger");

  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {

    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });

    navMenu
      .querySelectorAll("a, button")
      .forEach(el => {

        el.addEventListener("click", () => {
          navMenu.classList.remove("active");
        });

      });
  }

  /* =========================
     INDEX PAGE – PRODUCTS
  ========================= */

  const productGrid =
    document.getElementById("productGrid");

  if (productGrid) {

    let products =
      JSON.parse(localStorage.getItem("products"));

    /* DEFAULT PRODUCTS */

    if (!Array.isArray(products)) {

      products = [

        {
          id: 1,
          title: "Jacket",
          price: 10.99,
          image: "assets/product1.webp",
          description: "A cozy jacket"
        },

        {
          id: 2,
          title: "T-Shirt",
          price: 9.10,
          image: "assets/product2.webp",
          description: "Comfortable T-Shirt"
        },

        {
          id: 3,
          title: "Jeans",
          price: 30.89,
          image: "assets/product3.webp",
          description: "Stylish Jeans"
        },

        {
          id: 4,
          title: "Shoes",
          price: 29.80,
          image: "assets/product4.webp",
          description: "Sporty Shoes"
        }

      ];

      localStorage.setItem(
        "products",
        JSON.stringify(products)
      );
    }

    productGrid.innerHTML = "";

    /* CREATE PRODUCT CARDS */

    products.forEach(product => {

      const card = document.createElement("div");

      card.className = "product-card";

      card.innerHTML = `

        <a href="product.html?id=${product.id}">

          <img
            src="${product.image}"

            srcset="
              ${product.image} 480w,
              ${product.image} 768w,
              ${product.image} 1200w
            "

            sizes="(max-width: 768px) 100vw, 50vw"

            width="300"
            height="300"

            alt="${product.title}"

            loading="lazy"

            decoding="async"

            onerror="this.src='assets/fallback.webp'"
          >

          <h3>${product.title}</h3>

        </a>

        <p class="price">
          $${product.price.toFixed(2)}
        </p>

        <button class="btn">
          Add to Cart
        </button>

      `;

      /* ADD TO CART */

      const btn = card.querySelector(".btn");

      btn.addEventListener("click", () => {

        const existing =
          cart.find(i => i.id === product.id);

        if (existing) {

          if (existing.quantity < 10) {
            existing.quantity++;
          }

        } else {

          cart.push({
            ...product,
            quantity: 1
          });
        }

        saveCart();

        btn.textContent = "✅ Added";

        setTimeout(() => {
          btn.textContent = "Add to Cart";
        }, 1200);

      });

      productGrid.appendChild(card);

    });

  }

  /* =========================
     PRODUCT DETAIL PAGE
  ========================= */

  const productContainer =
    document.getElementById("product-container");

  if (productContainer) {

    const params =
      new URLSearchParams(window.location.search);

    const productId =
      Number(params.get("id"));

    const products =
      JSON.parse(localStorage.getItem("products")) || [];

    const product =
      products.find(p => p.id === productId);

    if (!product) {

      productContainer.innerHTML =
        "<p>Product not found</p>";

      return;
    }

    let quantity = 1;

    /* PRODUCT IMAGE */

    const mainImage =
      document.getElementById("mainProductImage");

    if (mainImage) {

      mainImage.src = product.image;

      mainImage.srcset = `
        ${product.image} 480w,
        ${product.image} 768w,
        ${product.image} 1200w
      `;

      mainImage.sizes =
        "(max-width: 768px) 100vw, 50vw";

      mainImage.loading = "lazy";

      mainImage.decoding = "async";

      mainImage.width = 500;

      mainImage.height = 500;

      mainImage.alt = product.title;

    }

    /* PRODUCT DETAILS */

    const titleEl =
      document.getElementById("productTitle");

    const priceEl =
      document.getElementById("productPrice");

    const descEl =
      document.getElementById("productDescription");

    const totalPriceEl =
      document.getElementById("totalPrice");

    if (titleEl) {
      titleEl.textContent = product.title;
    }

    if (priceEl) {
      priceEl.textContent =
        product.price.toFixed(2);
    }

    if (descEl) {
      descEl.textContent =
        product.description;
    }

    if (totalPriceEl) {
      totalPriceEl.textContent =
        product.price.toFixed(2);
    }

    /* QUANTITY CONTROLS */

    const quantityEl =
      document.getElementById("quantity");

    const increaseBtn =
      document.getElementById("increaseQty");

    const decreaseBtn =
      document.getElementById("decreaseQty");

    if (increaseBtn) {

      increaseBtn.onclick = () => {

        if (quantity < 10) {
          quantity++;
        }

        if (quantityEl) {
          quantityEl.textContent = quantity;
        }

        if (totalPriceEl) {
          totalPriceEl.textContent =
            (quantity * product.price).toFixed(2);
        }

      };
    }

    if (decreaseBtn) {

      decreaseBtn.onclick = () => {

        if (quantity > 1) {
          quantity--;
        }

        if (quantityEl) {
          quantityEl.textContent = quantity;
        }

        if (totalPriceEl) {
          totalPriceEl.textContent =
            (quantity * product.price).toFixed(2);
        }

      };
    }

    /* ADD TO CART */

    const addToCartBtn =
      document.querySelector(".add-to-cart");

    if (addToCartBtn) {

      addToCartBtn.onclick = () => {

        const existing =
          cart.find(i => i.id === product.id);

        if (existing) {

          existing.quantity += quantity;

        } else {

          cart.push({
            ...product,
            quantity
          });
        }

        saveCart();

        addToCartBtn.textContent =
          "✅ Added";

        setTimeout(() => {

          addToCartBtn.textContent =
            "Add to Cart";

        }, 1200);

      };
    }

  }

  /* =========================
     CART PAGE
  ========================= */

  const cartItemsContainer =
    document.getElementById("cartItems");

  const cartTotalEl =
    document.getElementById("cartTotal");

  const checkoutBtn =
    document.getElementById("checkoutBtn");

  function renderCart() {

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";

    /* EMPTY CART */

    if (cart.length === 0) {

      cartItemsContainer.innerHTML =
        "<p>Your cart is empty.</p>";

      if (cartTotalEl) {
        cartTotalEl.textContent = "0.00";
      }

      if (checkoutBtn) {
        checkoutBtn.disabled = true;
      }

      return;
    }

    let total = 0;

    if (checkoutBtn) {
      checkoutBtn.disabled = false;
    }

    /* RENDER ITEMS */

    cart.forEach((item, index) => {

      total += item.price * item.quantity;

      const div = document.createElement("div");

      div.className = "cart-item";

      div.innerHTML = `

        <img
          src="${item.image}"

          width="120"
          height="120"

          alt="${item.title}"

          loading="lazy"

          decoding="async"
        >

        <div class="cart-info">

          <h3>${item.title}</h3>

          <p>$${item.price.toFixed(2)}</p>

          <div class="qty-controls">

            <button class="decrease">−</button>

            <span>${item.quantity}</span>

            <button class="increase">+</button>

          </div>

          <button class="remove-btn">
            Remove
          </button>

        </div>

      `;

      /* INCREASE */

      div.querySelector(".increase")
        .onclick = () => {

          if (item.quantity < 10) {
            item.quantity++;
          }

          saveCart();

          renderCart();

        };

      /* DECREASE */

      div.querySelector(".decrease")
        .onclick = () => {

          if (item.quantity > 1) {

            item.quantity--;

            saveCart();

            renderCart();

          }

        };

      /* REMOVE */

      div.querySelector(".remove-btn")
        .onclick = () => {

          cart.splice(index, 1);

          saveCart();

          renderCart();

        };

      cartItemsContainer.appendChild(div);

    });

    /* TOTAL */

    if (cartTotalEl) {

      cartTotalEl.textContent =
        total.toFixed(2);

    }

  }

  renderCart();

  /* =========================
     CHECKOUT BUTTON
  ========================= */

  if (checkoutBtn) {

    checkoutBtn.onclick = () => {

      window.location.href =
        "checkout.html";

    };

  }

});