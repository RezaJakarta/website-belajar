// ==================== GLOBAL VARIABLES ====================
const CONFIG = {
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 3000,
  SCROLL_THRESHOLD: 100,
  WHATSAPP_NUMBER: "6285811139858",
  WHATSAPP_MESSAGE:
    "Hello%20G%26M%20Store%2C%20I%20need%20a%20premium%20product%20information",
};

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = "info", translate = false) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  // Translate if needed
  let displayMessage = message;
  if (translate && window.i18n) {
    displayMessage = window.i18n.t(message);
  }

  if (toast.timeoutId) {
    clearTimeout(toast.timeoutId);
  }

  toast.textContent = displayMessage;
  toast.className = `toast show ${type}`;

  toast.timeoutId = setTimeout(() => {
    toast.classList.remove("show");
  }, CONFIG.TOAST_DURATION);
}

// Make showToast globally available
window.showToast = showToast;

// ==================== LOCAL STORAGE UTILS ====================
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Error writing to localStorage:", error);
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing from localStorage:", error);
      return false;
    }
  },
};

// ==================== THEME MANAGEMENT ====================
const themeManager = {
  init() {
    this.themeToggle = document.getElementById("themeToggle");
    if (!this.themeToggle) return;

    // Load saved theme
    const savedTheme = storage.get("theme") || "dark";
    this.setTheme(savedTheme);

    // Add event listener
    this.themeToggle.addEventListener("click", () => this.toggle());
  },

  setTheme(theme) {
    document.body.className = theme === "light" ? "light-theme" : "";
    if (this.themeToggle) {
      this.themeToggle.querySelector(".theme-icon").textContent =
        theme === "light" ? "☀️" : "🌙";
    }
    storage.set("theme", theme);
  },

  toggle() {
    const currentTheme = document.body.className.includes("light-theme")
      ? "light"
      : "dark";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
    showToast(
      `${newTheme === "light" ? "☀️" : "🌙"} Theme changed to ${newTheme}`,
      "success",
    );
  },
};

// ==================== NAVBAR ====================
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!navbar) return;

  // Handle scroll
  const handleScroll = () => {
    if (window.scrollY > CONFIG.SCROLL_THRESHOLD) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", throttle(handleScroll, 100));
  handleScroll(); // Initial check

  // Mobile menu
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      const isExpanded = hamburger.classList.contains("active");
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", !isExpanded);
      document.body.style.overflow = !isExpanded ? "hidden" : "";
    });
  }

  // Close menu on link click
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (hamburger && navMenu) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && hamburger?.classList.contains("active")) {
      hamburger.click();
    }
  });
}

// ==================== SCROLL REVEAL ====================
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    "section, .stat-item, .product-card, .contact-card, .value-item, .testimonial-card",
  );

  if (revealElements.length === 0) return;

  // Initial setup
  revealElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target); // Stop observing once revealed
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((el) => observer.observe(el));
}

// ==================== STATS COUNTER ====================
function initStatsCounter() {
  const stats = document.querySelectorAll(".stat-number");
  if (stats.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stat = entry.target;
          const target = parseInt(stat.getAttribute("data-target"));
          const suffix = stat.getAttribute("data-suffix") || "+";

          if (!target) return;

          let current = 0;
          const increment = target / 50;
          const duration = 2000; // 2 seconds
          const stepTime = duration / 50;

          const updateCount = () => {
            if (current < target) {
              current += increment;
              stat.textContent = Math.ceil(current) + suffix;
              requestAnimationFrame(updateCount);
            } else {
              stat.textContent = target + suffix;
            }
          };

          updateCount();
          observer.unobserve(stat);
        }
      });
    },
    { threshold: 0.5 },
  );

  stats.forEach((stat) => observer.observe(stat));
}

// ==================== NEWSLETTER FORM ====================
function initNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    const errorElement =
      form.querySelector(".form-error") || document.createElement("div");

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      emailInput.classList.add("error");
      errorElement.className = "form-error";
      errorElement.textContent = "Please enter a valid email address";
      if (!form.querySelector(".form-error")) {
        emailInput.parentNode.appendChild(errorElement);
      }
      return;
    }

    // Success
    emailInput.classList.remove("error");
    if (errorElement.parentNode) {
      errorElement.remove();
    }

    // Show success message
    showToast(
      "Thank you for subscribing! Check your email for confirmation.",
      "success",
    );
    form.reset();

    // You could also send this to your backend
    console.log("Newsletter subscription:", email);
  });
}

// ==================== BACK TO TOP ====================
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  const handleScroll = () => {
    if (window.scrollY > 300) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// ==================== LAZY LOAD IMAGES ====================
function initLazyLoading() {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute("data-src");
          if (src) {
            img.src = src;
            img.removeAttribute("data-src");
          }
          imageObserver.unobserve(img);
        }
      });
    });

    document
      .querySelectorAll("img[data-src]")
      .forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    document.querySelectorAll("img[data-src]").forEach((img) => {
      img.src = img.getAttribute("data-src");
      img.removeAttribute("data-src");
    });
  }
}

// ==================== TOOLTIPS ====================
function initTooltips() {
  const tooltipElements = document.querySelectorAll("[data-tooltip]");

  tooltipElements.forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.textContent = e.target.dataset.tooltip;
      document.body.appendChild(tooltip);

      const rect = e.target.getBoundingClientRect();
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
      tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;

      e.target.addEventListener(
        "mouseleave",
        () => {
          tooltip.remove();
        },
        { once: true },
      );
    });
  });
}

// ==================== ERROR HANDLING ====================
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error);
  showToast("An error occurred. Please try again.", "error");
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason);
  showToast("An error occurred. Please try again.", "error");
});

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Main.js loaded - Initializing components...");

  // Initialize all components
  initNavbar();
  initScrollReveal();
  initStatsCounter();
  initNewsletterForm();
  initBackToTop();
  initSmoothScroll();
  initLazyLoading();
  initTooltips();

  // Initialize theme manager
  themeManager.init();

  // Initialize wishlist manager
  wishlistManager.init();

  // Add loading class to body
  document.body.classList.add("loaded");

  // Check for URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  if (category) {
    console.log("Category from URL:", category);
    // You can handle category filtering here
  }
});

// Export for use in other modules
window.utils = {
  debounce,
  throttle,
  storage,
  showToast,
};
