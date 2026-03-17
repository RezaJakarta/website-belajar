class I18n {
  constructor() {
    this.currentLocale = localStorage.getItem("gm_locale") || "en";
    this.translations = {
      en: window.enTranslations || {},
      id: window.idTranslations || {},
    };
    this.fallbackLocale = "en";
    this.listeners = [];
  }

  init() {
    this.setLocale(this.currentLocale);
    this.addLanguageSwitcher();
    this.translatePage();

    document.addEventListener("languageChanged", (e) => {
      console.log("Language changed to:", e.detail.locale);
    });
  }

  setLocale(locale) {
    if (this.translations[locale]) {
      this.currentLocale = locale;
      localStorage.setItem("gm_locale", locale);
      this.notifyListeners();
      this.translatePage();
      this.updateLanguageSwitcher();
      return true;
    }
    return false;
  }

  getLocale() {
    return this.currentLocale;
  }

  t(key, params = {}) {
    let translation = this.translations[this.currentLocale]?.[key];

    if (!translation && this.currentLocale !== this.fallbackLocale) {
      translation = this.translations[this.fallbackLocale]?.[key];
    }

    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    Object.keys(params).forEach((param) => {
      translation = translation.replace(`{{${param}}}`, params[param]);
    });

    return translation;
  }

  translatePage() {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = this.t(key);

      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        if (element.hasAttribute("placeholder")) {
          element.setAttribute("placeholder", translation);
        } else {
          element.value = translation;
        }
      } else if (element.tagName === "IMG") {
        element.setAttribute("alt", translation);
      } else {
        if (translation.includes("<") && translation.includes(">")) {
          element.innerHTML = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      const data = element.getAttribute("data-i18n-attr").split(":");
      if (data.length === 2) {
        const [attr, key] = data;
        element.setAttribute(attr, this.t(key));
      }
    });

    document.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { locale: this.currentLocale },
      }),
    );
  }

  addLanguageSwitcher() {
    if (document.getElementById("languageSwitcher")) return;

    const navActions = document.querySelector(".nav-actions");
    if (!navActions) {
      setTimeout(() => this.addLanguageSwitcher(), 500);
      return;
    }

    console.log("Adding language switcher to nav actions");

    const switcher = document.createElement("div");
    switcher.id = "languageSwitcher";
    switcher.className = "language-switcher";
    switcher.setAttribute("aria-label", "Language switcher");

    switcher.innerHTML = `
            <button class="lang-btn ${this.currentLocale === "en" ? "active" : ""}" data-lang="en">
                EN
            </button>
            <button class="lang-btn ${this.currentLocale === "id" ? "active" : ""}" data-lang="id">
                ID
            </button>
        `;

    const themeToggle = navActions.querySelector(".theme-toggle");
    if (themeToggle) {
      navActions.insertBefore(switcher, themeToggle);
    } else {
      navActions.prepend(switcher);
    }

    switcher.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const lang = btn.getAttribute("data-lang");
        this.setLocale(lang);

        if (window.showToast) {
          const message =
            lang === "en"
              ? "Language changed to English"
              : "Bahasa diubah ke Indonesia";
          window.showToast(message, "success");
        }
      });
    });
  }

  updateLanguageSwitcher() {
    const switcher = document.getElementById("languageSwitcher");
    if (!switcher) return;

    switcher.querySelectorAll(".lang-btn").forEach((btn) => {
      const lang = btn.getAttribute("data-lang");
      btn.classList.toggle("active", lang === this.currentLocale);
    });
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  notifyListeners() {
    this.listeners.forEach((callback) => callback(this.currentLocale));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing i18n...");
  window.i18n = new I18n();
  window.i18n.init();
});

const i18nStyle = document.createElement("style");
i18nStyle.textContent = `
    .language-switcher {
        display: flex;
        gap: 5px;
        margin-right: 10px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 30px;
        padding: 3px;
        border: 1px solid rgba(198, 164, 92, 0.2);
    }

    .lang-btn {
        background: transparent;
        border: none;
        color: #999;
        font-size: 0.8rem;
        font-weight: 600;
        padding: 6px 12px;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        letter-spacing: 0.5px;
        min-width: 40px;
        text-transform: uppercase;
    }

    .lang-btn:hover {
        color: var(--gold);
        background: rgba(198, 164, 92, 0.1);
    }

    .lang-btn.active {
        background: var(--gold);
        color: var(--black);
    }

    body.light-theme .language-switcher {
        background: rgba(0, 0, 0, 0.05);
        border-color: rgba(198, 164, 92, 0.3);
    }

    body.light-theme .lang-btn {
        color: #666;
    }

    body.light-theme .lang-btn:hover {
        background: rgba(198, 164, 92, 0.2);
        color: var(--gold-dark);
    }

    body.light-theme .lang-btn.active {
        background: var(--gold);
        color: var(--white);
    }

    @media (max-width: 768px) {
        .language-switcher {
            margin-right: 5px;
            padding: 2px;
        }
        
        .lang-btn {
            padding: 4px 8px;
            font-size: 0.7rem;
            min-width: 35px;
        }
    }

    @media (max-width: 480px) {
        .language-switcher {
            margin-right: 3px;
        }
        
        .lang-btn {
            padding: 3px 6px;
            font-size: 0.65rem;
            min-width: 30px;
        }
    }
`;
document.head.appendChild(i18nStyle);
