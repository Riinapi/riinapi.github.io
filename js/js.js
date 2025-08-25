document.addEventListener('DOMContentLoaded', function () {
  // --- Bootstrap ScrollSpy ---
  const mainNav = document.body.querySelector('#mainNav');
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#mainNav',
      rootMargin: '0px 0px -40%',
    });
  }

  // --- Sulje navbar responsiivisena klikatessa ---
  const navbarToggler = document.querySelector('.navbar-toggler');
  const responsiveNavItems = document.querySelectorAll('#navbarResponsive .nav-link');
  responsiveNavItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click();
      }
    });
  });

  // --- OSAAMINEN (sisältökytkimet) ---
  const contentSwitchers = document.querySelectorAll('.content-switcher');
  const contentDisplays = document.querySelectorAll('.content-display');

  function showContent(targetId) {
    contentDisplays.forEach(display => display.classList.remove('active-display'));
    contentSwitchers.forEach(switcher => switcher.classList.remove('active'));

    const targetDisplay = document.getElementById(targetId);
    if (targetDisplay) {
      targetDisplay.classList.add('active-display');
    }

    const activeSwitcher = document.querySelector(`.content-switcher[data-target="${targetId}"]`);
    if (activeSwitcher) {
      activeSwitcher.classList.add('active');
    }
  }

  if (contentSwitchers.length) {
    const initial = document.querySelector('.content-switcher.active') || contentSwitchers[0];
    showContent(initial.dataset.target);

    contentSwitchers.forEach(switcher => {
      switcher.addEventListener('click', function () {
        showContent(this.dataset.target);
      });
    });
  }

  // --- PÄÄSIVUN SWIPER ALUSTUS ---
  var swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: false,
    allowTouchMove: true,
    centeredSlides: true,
    slidesPerView: 2,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 4,
      slideShadows: true
    },
    loop: true,
    keyboard: {
      enabled: false
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    breakpoints: {
      576: {
        slidesPerView: 2.5,
        allowTouchMove: true
      },
      768: {
        slidesPerView: 2.5,
        allowTouchMove: true
      },
      1024: {
        slidesPerView: 3,
        allowTouchMove: false
      }
    }
  });

  // --- MODAALI ---
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('projectModalBody');
  let loadedProject = null;

  modal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const project = button.getAttribute('data-project');
    if (!project) return;
    if (loadedProject === project) return;

    loadedProject = project;
    modalBody.innerHTML = '<p class="text-white">Ladataan sisältöä...</p>';

    fetch(`projects/${project}.html`)
      .then(response => {
        if (!response.ok) throw new Error('Tiedostoa ei löytynyt');
        return response.text();
      })
      .then(html => {
        modalBody.innerHTML = html;
      })
      .catch(() => {
        modalBody.innerHTML = '<p class="text-danger">Sisältöä ei voitu ladata.</p>';
      });
  });

  modal.addEventListener('shown.bs.modal', () => {
    const swiperEl = modal.querySelector('.modal-swiper');
    if (!swiperEl) return;

    const isSingleSlide = swiperEl.classList.contains('single-slide');

    const swiper = new Swiper(swiperEl, {
      effect: "coverflow",
      grabCursor: false,
      centeredSlides: true,
      allowTouchMove: true,
      slidesPerView: isSingleSlide ? 1 : 'auto',
      loop: true,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 4,
        slideShadows: true
      },
      pagination: {
        el: ".modal-swiper-pagination",
        clickable: true
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      breakpoints: {
        576: { allowTouchMove: true },
        768: { allowTouchMove: true },
        1024: { allowTouchMove: false }
      }
    });

    swiperEl.classList.add('swiper-ready');
  });

  // --- NAVIGAATION TAUSTAVÄRI SCROLLATESSA ---
  function toggleNavbarBackground() {
    if (window.scrollY > 50) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', toggleNavbarBackground);
  toggleNavbarBackground();
});
