document.addEventListener('DOMContentLoaded', function () {
  // --- Bootstrap ScrollSpy ---
  // Alustetaan ScrollSpy, joka korostaa navigaatiosta aktiivisen kohdan
  const mainNav = document.body.querySelector('#mainNav');
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#mainNav',
      rootMargin: '0px 0px -40%',
    });
  }

  // --- Sulje navbar responsiivisena klikatessa ---
  // Kun navbarin linkkiä klikataan mobiilissa, suljetaan navbar automaattisesti
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
  // Sisällön vaihto, kun painetaan sisältökytkintä (esim. tabit tms.)
  const contentSwitchers = document.querySelectorAll('.content-switcher');
  const contentDisplays = document.querySelectorAll('.content-display');

  function showContent(targetId) {
    // Poistetaan kaikista sisällöistä aktiivisuusluokat
    contentDisplays.forEach(display => display.classList.remove('active-display'));
    contentSwitchers.forEach(switcher => switcher.classList.remove('active'));

    // Näytetään kohde-elementti ja korostetaan valitsin
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
    // Näytetään aluksi aktiivinen tai ensimmäinen sisältö
    const initial = document.querySelector('.content-switcher.active') || contentSwitchers[0];
    showContent(initial.dataset.target);

    // Lisätään kuuntelija sisältökytkimille
    contentSwitchers.forEach(switcher => {
      switcher.addEventListener('click', function () {
        showContent(this.dataset.target);
      });
    });
  }

  // --- PÄÄSIVUN SWIPER ALUSTUS ---
  // Alustetaan Swiper-kirjaston karuselli pääsivulle
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
    // Kun näytön leveys on vähintään 576px
    576: {
      slidesPerView: 2.5, 
      allowTouchMove: true // Voit pitää sen true:na täälläkin, jos haluat
    },
    // Kun näytön leveys on vähintään 768px
    768: {
      slidesPerView: 2.5,
      allowTouchMove: true // Tai tässäkin, riippuen tarpeesta
    },
    // Kun näytön leveys on vähintään 1024px (läppäri ja isommat näytöt)
    1024: {
      slidesPerView: 3,
      allowTouchMove: false // <-- TÄSSÄ SE MUUTUU FALSE:KSI
    }
  }
    
  });

  // --- MODAALI ---
const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('projectModalBody');
let loadedProject = null; // seuraava vaiheessa tarkistetaan, ettei alusteta useasti

// Kun modaalin avaus alkaa (haetaan sisältö)
modal.addEventListener('show.bs.modal', event => {
  const button = event.relatedTarget;
  const project = button.getAttribute('data-project');
  if (!project) return;

  // Estetään uudelleenlataus, jos sama projekti on jo ladattu
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

// Kun modaali on täysin näkyvä (alustetaan swiper)
modal.addEventListener('shown.bs.modal', () => {
  const swiperEl = modal.querySelector('.modal-swiper');
  if (!swiperEl) return;

  // Tarkista onko lisäluokka 'simple'
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

});
