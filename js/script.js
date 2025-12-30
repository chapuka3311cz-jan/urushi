document.addEventListener("DOMContentLoaded", () => {
  /* ハンバーガーメニュー */
  const navToggle = document.querySelector(".nav-toggle");
  const globalNav = document.querySelector("#global-nav");

  if (navToggle && globalNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = globalNav.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    globalNav.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() === "a") {
        globalNav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* TOP HERO Swiper（フェード） */
  if (typeof Swiper !== "undefined" && document.querySelector(".hero-swiper")) {
    // eslint-disable-next-line no-undef
    new Swiper(".hero-swiper", {
      effect: "fade",
      loop: true,
      speed: 1200,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
    });
  }

  /* WORKS Swiper */
  if (typeof Swiper !== "undefined" && document.querySelector(".works-swiper")) {
    // eslint-disable-next-line no-undef
    new Swiper(".works-swiper", {
      loop: true,
      speed: 800,
      slidesPerView: 1,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }

  /* スクロール矢印 */
  const scrollButtons = document.querySelectorAll(".js-scroll-down");
  scrollButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentSection = btn.closest("section");
      let target = currentSection ? currentSection.nextElementSibling : null;
      while (target && !target.classList.contains("section")) {
        target = target.nextElementSibling;
      }
      if (target) {
        const top =
          target.getBoundingClientRect().top + window.scrollY - 40;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* TOPへ戻るボタン */
  const pageTopBtn = document.querySelector(".js-page-top");
  const togglePageTop = () => {
    if (!pageTopBtn) return;
    if (window.scrollY > 400) {
      pageTopBtn.classList.add("is-visible");
    } else {
      pageTopBtn.classList.remove("is-visible");
    }
  };
  window.addEventListener("scroll", togglePageTop);
  togglePageTop();

  if (pageTopBtn) {
    pageTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* CONTACT 簡易バリデーション */
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const requiredIds = ["name", "email", "message"];
      let hasError = false;

      document
        .querySelectorAll(".form-error")
        .forEach((el) => (el.textContent = ""));

      requiredIds.forEach((id) => {
        const input = document.getElementById(id);
        const error = document.querySelector(
          `.form-error[data-for="${id}"]`
        );
        if (!input || !error) return;
        if (!input.value.trim()) {
          error.textContent = "必須項目です。";
          hasError = true;
        }
      });

      const emailInput = document.getElementById("email");
      const emailError = document.querySelector(
        '.form-error[data-for="email"]'
      );
      if (emailInput && emailError && emailInput.value.trim()) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(emailInput.value.trim())) {
          emailError.textContent = "メールアドレスの形式が正しくありません。";
          hasError = true;
        }
      }

      if (!hasError) {
        alert("送信しました。（ダミー動作）");
        contactForm.reset();
      }
    });
  }
});
