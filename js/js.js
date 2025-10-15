document.addEventListener('DOMContentLoaded', function () {
 
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

  // --- PÄÄSIVUN SWIPER ALUSTUS ---
  var swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    allowTouchMove: true,
    centeredSlides: true,
    slidesPerView: 2,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 4,
      slideShadows: false,
    },
    loop: true,
    on: {
      slideChange: function () {
        const slides = this.slides;
        slides.forEach(slide => {
          slide.classList.remove('level-1', 'level-2', 'level-3');
        });

        const activeIndex = this.activeIndex;

        for (let i = 1; i <= 3; i++) {
          const prev = slides[(activeIndex - i + slides.length) % slides.length];
          const next = slides[(activeIndex + i) % slides.length];

          prev.classList.add(`level-${i}`);
          next.classList.add(`level-${i}`);
        }
      },
    },
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
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 3,
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
      effect: isSingleSlide ? "fade" : "coverflow",
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
        slideShadows: false
      },
      pagination: {
        el: ".modal-swiper-pagination",
        clickable: true
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
    });

    // --- Jos modaalissa on video, lisätään automaattinen toisto
    const video = swiperEl.querySelector('video'); // haetaan video vain tämän Swiperin sisältä
    if (video) {
      function handleVideo() {
        const activeSlide = swiper.slides[swiper.activeIndex];
        if (activeSlide.contains(video)) {
          video.muted = true;
          video.play();
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }

      swiper.on('slideChange', handleVideo);
      handleVideo(); // tarkistetaan aktiivinen slide heti
    }

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

  // --- Päivitetään HTML-title klikkauksen mukaan ---
  document.querySelectorAll('#navbarResponsive .nav-link, .navbar-brand').forEach(link => {
    link.addEventListener('click', () => {
      // Käytetään data-titlea, jos se on määritelty, muuten linkin tekstiä
      document.title = link.dataset.title || link.textContent;
    });
  });

  // --- NAV-LINKIEN AKTIIVINEN TILA SCROLLATTAESSA ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('#navbarResponsive .nav-link');

  function updateActiveNav() {
  let current = "";
  const scrollPosition = window.scrollY + window.innerHeight / 3;
  const pageBottom = window.scrollY + window.innerHeight;
  const pageHeight = document.documentElement.scrollHeight;

  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    // Jos ollaan sivun lopussa -> valitaan viimeinen section
    if (pageBottom >= pageHeight - 5 && index === sections.length - 1) {
      current = section.getAttribute("id");
    } 
    // Muuten normaali logiikka
    else if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}


  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav(); // tarkistetaan heti sivun latauduttua

});

  

