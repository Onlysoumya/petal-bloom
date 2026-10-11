const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});
document.querySelectorAll(".nav-links a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  })
);

// Reveal sections as they enter the viewport.
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

// Filter the bouquet collection.
const filterButtons = document.querySelectorAll(".filter");
const productCards = document.querySelectorAll(".product-card");
filterButtons.forEach((button) =>
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const category = button.dataset.filter;
    productCards.forEach((card, index) => {
      const show = category === "all" || card.dataset.category === category;
      card.hidden = !show;
      if (show) {
        card.classList.remove("visible");
        card.style.transitionDelay = `${index * 60}ms`;
        requestAnimationFrame(() => card.classList.add("visible"));
      }
    });
  })
);

const toast = document.querySelector(".toast");
let toastTimer;
// Animated cart drawer with quantity controls and subtotal (front-end demo).
const cart = [];
const productCatalog = {
  "Rose Reverie": {
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=240&q=80",
    detail: "Blush roses · eucalyptus",
  },
  "Golden Hour": {
    price: 999,
    image:
      "https://images.unsplash.com/photo-1597848212624-e6cf9a7b6e4a?auto=format&fit=crop&w=240&q=80",
    detail: "Sunflowers · seasonal greens",
  },
  "Sunday Daydream": {
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=240&q=80",
    detail: "Pastel mix · seasonal stems",
  },
  "Wildflower Waltz": {
    price: 1199,
    image:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=240&q=80",
    detail: "Wildflowers · delicate blooms",
  },

  "Lavender Dreams": {
    price: 899,
    image:
      "https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=240&q=80",
    detail: "Lavender · purple seasonal blooms",
  },
  "White Elegance": {
    price: 1099,
    image:
      "https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=240&q=80",
    detail: "White blooms · fresh greenery",
  },
  "Pink Paradise": {
    price: 1399,
    image:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=240&q=80",
    detail: "Pink blooms · romantic arrangement",
  },
  "Spring Garden": {
    price: 1599,
    image:
      "https://images.unsplash.com/photo-1494625927555-6ec4433b1571?auto=format&fit=crop&w=240&q=80",
    detail: "Mixed seasonal flowers",
  },
};
const cartDrawer = document.querySelector(".cart-drawer");
const cartBackdrop = document.querySelector(".drawer-backdrop");
const cartItems = document.querySelector(".cart-items");
const cartSummary = document.querySelector(".cart-summary");
const cartSubtotal = document.querySelector(".cart-subtotal");
function money(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
function openCart() {
  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("overlay-open");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  if (!document.querySelector(".signin-modal.open"))
    document.body.classList.remove("overlay-open");
}
document.querySelector("[data-open-cart]").addEventListener("click", openCart);
document
  .querySelectorAll("[data-close-cart]")
  .forEach((el) => el.addEventListener("click", closeCart));
document
  .querySelector("[data-continue-shopping]")
  .addEventListener("click", closeCart);
function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelector(".bag-count").textContent = totalItems;
  document.querySelector(".bag-count").classList.remove("bump");
  void document.querySelector(".bag-count").offsetWidth;
  document.querySelector(".bag-count").classList.add("bump");
  const total = cart.reduce(
    (sum, item) => sum + item.qty * productCatalog[item.name].price,
    0
  );
  cartSubtotal.textContent = money(total);
  cartSummary.hidden = cart.length === 0;
  if (!cart.length) {
    cartItems.innerHTML =
      '<div class="empty-cart"><span>✿</span><h3>Your bag is waiting to bloom</h3><p>Add a bouquet to make someone’s day.</p><button class="button button-dark" type="button" data-continue-shopping>Explore bouquets <span>↗</span></button></div>';
    cartItems
      .querySelector("[data-continue-shopping]")
      .addEventListener("click", closeCart);
    return;
  }
  cartItems.innerHTML = cart
    .map((item) => {
      const product = productCatalog[item.name];
      return `<article class="cart-row"><img src="${product.image}" alt="${item.name}"><div><h3>${item.name}</h3><p>${product.detail}</p><div class="quantity-controls"><button type="button" data-qty="-1" data-name="${item.name}" aria-label="Decrease ${item.name} quantity">−</button><span>${item.qty}</span><button type="button" data-qty="1" data-name="${item.name}" aria-label="Increase ${item.name} quantity">+</button><button class="remove-item" type="button" data-remove="${item.name}">Remove</button></div></div><strong class="line-price">${money(product.price * item.qty)}</strong></article>`;
    })
    .join("");
  cartItems.querySelectorAll("[data-qty]").forEach((button) =>
    button.addEventListener("click", () => {
      const item = cart.find((entry) => entry.name === button.dataset.name);
      item.qty += Number(button.dataset.qty);
      if (item.qty <= 0) cart.splice(cart.indexOf(item), 1);
      renderCart();
    })
  );
  cartItems.querySelectorAll("[data-remove]").forEach((button) =>
    button.addEventListener("click", () => {
      const index = cart.findIndex(
        (item) => item.name === button.dataset.remove
      );
      if (index !== -1) cart.splice(index, 1);
      renderCart();
    })
  );
}
document.querySelectorAll(".quick-add").forEach((button) =>
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const existing = cart.find((item) => item.name === name);
    if (existing) existing.qty += 1;
    else cart.push({ name, qty: 1 });
    renderCart();
    toast.textContent = `${name} added to your bag ♡`;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
    button.textContent = "✓";
    setTimeout(() => (button.textContent = "+"), 900);
  })
);
document.querySelector(".checkout-button").addEventListener("click", () => {
  toast.textContent =
    "Checkout is a demo for now — connect a payment provider to launch.";
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
});
renderCart();

// Newsletter demo: validates email, then shows a friendly confirmation.
document
  .querySelector(".newsletter-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.querySelector("#email");
    const message = document.querySelector(".form-message");
    if (!email.checkValidity()) {
      email.reportValidity();
      return;
    }
    message.textContent = "You’re on the list! A little bloom is on its way ♡";
    message.style.color = "#496444";
    email.value = "";
  });

// Sign-in modal: animated, accessible demo form (no backend/authentication).
const signinModal = document.querySelector(".signin-modal");
const signinBackdrop = document.querySelector(".modal-backdrop");
const signinForm = document.querySelector(".signin-form");
function openSignin() {
  signinModal.classList.add("open");
  signinBackdrop.classList.add("open");
  signinModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("overlay-open");
  setTimeout(() => document.querySelector("#signin-email").focus(), 180);
}
function closeSignin() {
  signinModal.classList.remove("open");
  signinBackdrop.classList.remove("open");
  signinModal.setAttribute("aria-hidden", "true");
  if (!cartDrawer.classList.contains("open"))
    document.body.classList.remove("overlay-open");
}
document
  .querySelector("[data-open-signin]")
  .addEventListener("click", openSignin);
document
  .querySelectorAll("[data-close-signin]")
  .forEach((el) => el.addEventListener("click", closeSignin));
document
  .querySelector(".password-toggle")
  .addEventListener("click", (event) => {
    const password = document.querySelector("#signin-password");
    const visible = password.type === "password";
    password.type = visible ? "text" : "password";
    event.currentTarget.textContent = visible ? "Hide" : "Show";
    event.currentTarget.setAttribute(
      "aria-label",
      visible ? "Hide password" : "Show password"
    );
  });
signinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#signin-email");
  const password = document.querySelector("#signin-password");
  if (!email.checkValidity() || !password.checkValidity()) {
    signinForm.reportValidity();
    return;
  }
  document.querySelector(".signin-message").textContent =
    "Demo sign-in complete! Real account access needs a backend.";
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeSignin();
  }
});

// Update the active nav item as the page scrolls.
const sections = document.querySelectorAll("main section[id]");
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".nav-links a").forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);
sections.forEach((section) => navObserver.observe(section));
