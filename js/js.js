document.addEventListener('DOMContentLoaded', function () {

  // NAVIGAATIO 

  // Navbarin sulkeutuminen pienemmillä näytöillä klikatessa
  const navbarToggler = document.querySelector('.navbar-toggler');
  const responsiveNavItems = document.querySelectorAll('#navbarResponsive .nav-link');
  responsiveNavItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click();
      }
    });
  });

  // Navbarin taustavärin vaihtuminen scrollatessa
  const mainNav = document.querySelector('.navbar');
  function toggleNavbarBackground() {
    if (window.scrollY > 100) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', toggleNavbarBackground);
  toggleNavbarBackground();

  // Päivitetään HTML-title navin linkin klikkauksen mukaan
  document.querySelectorAll('#navbarResponsive .nav-link, .navbar-brand').forEach(link => {
    link.addEventListener('click', () => {
      document.title = link.dataset.title || link.textContent;
    });
  });

  // Nav linkkien aktiivisen tilan vaihtuminen scrollatessa
  const sections = document.querySelectorAll('section'); // Haetaan kaikki sivun <section>-elementit
  const navLinks = document.querySelectorAll('#navbarResponsive .nav-link'); // Haetaan kaikki navigaatiolinkit (joilla on luokka .nav-link navbarissa)

  // Funktio, joka päivittää aktiivisen linkin sen mukaan, missä kohtaa sivua ollaan
  function updateActiveNav() {
     // Näkyvissä olevan sectionin id
    let current = "";
    // Lasketaan nykyinen vierityspaikka
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    // Sivun alaosan ja koko korkeuden laskenta 
    const pageBottom = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

     // Käydään kaikki sectionit läpi
    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;  // Sectionin yläreunan etäisyys sivun alusta
      const sectionHeight = section.offsetHeight; // Sectionin korkeus

      // Jos ollaan aivan sivun lopussa, asetetaan viimeinen section aktiiviseksi (pienemillä näytöillä sectionit ovat pienempiä)
      if (pageBottom >= pageHeight - 5 && index === sections.length - 1) {
        current = section.getAttribute("id");
        // Muuten tarkistetaan, kuuluuko nykyinen scrollauskohta tähän sectioniin
      } else if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    // Käydään kaikki navigaatiolinkit läpi ja päivitetään active-luokka
    navLinks.forEach(link => {
      link.classList.remove("active"); // Poistetaan mahdollinen aiempi active
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active"); // Lisätään active oikealle linkille
      }
    });
  }

  // Päivitetään aktiivinen linkki aina kun skrollataan
  window.addEventListener('scroll', updateActiveNav);
  // Suoritetaan heti sivun latauksessa
  updateActiveNav();


  // SWIPER KARUSELLI ETUSIVULLA 

  const swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: false,
    allowTouchMove: true,
    centeredSlides: true,
    slidesPerView: 3,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 4,
      slideShadows: false,
    },
    loop: true,
    on: {
      // Slaideille uudet luokat, jotta saadaan tummennus ja näkyvyys css hallittua
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
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
  });


  // MODAALI

  // Haetaan modaalin ja sen sisällön HTML-elementit
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('projectModalBody');
  let loadedProject = null;

  // Kun modaali avataan
  modal.addEventListener('show.bs.modal', async (event) => {
    // Haetaan se painike, joka avasi modaalin
    const button = event.relatedTarget;
    // Haetaan painikkeen data-attribuutista projektin nimi
    const project = button?.getAttribute('data-project');
    // Jos projektia ei ole määritelty tai se on jo ladattu, lopetetaan
    if (!project || loadedProject === project) return;

    loadedProject = project; // Päivitetään muistiin ladattu projekti
    modalBody.innerHTML = '<p class="text-white">Ladataan sisältöä...</p>';

    try {
      // Yritetään hakea projektin HTML-tiedosto palvelimelta
      const response = await fetch(`projects/${project}.html`);
      // Jos tiedostoa ei löydy
      if (!response.ok) throw new Error('Projektia ei löytynyt');
      // Jos lataus onnistuu, korvataan modaalin sisältö tiedoston sisällöllä
      modalBody.innerHTML = await response.text();
    } catch {
      // Jos lataus epäonnistuu, näytetään virheilmoitus
      modalBody.innerHTML = '<p class="text-danger">Sisältöä ei voitu ladata.</p>';
    }
  });

  // Kun modaali on täysin näkyvissä
  modal.addEventListener('shown.bs.modal', () => {
    // Etsitään modaalista Swiper-elementti (kuvakaruselli)
    const swiperEl = modal.querySelector('.modal-swiper');
    if (!swiperEl) return;

    // Tarkistetaan onko swiperilla single-slide luokka (swiperissa näkyy yksi dia kerrallaan)
    const isSingleSlide = swiperEl.classList.contains('single-slide');

    const swiper = new Swiper(swiperEl, {
      effect: isSingleSlide ? 'fade' : 'coverflow', // määritetään efekti luokan mukaan
      centeredSlides: true,
      slidesPerView: isSingleSlide ? 1 : 'auto', // määritetään näkymä luokan mukaan
      loop: true,
      coverflowEffect: { 
        rotate: 0, 
        stretch: 0, 
        depth: 100, 
        modifier: 4, 
        slideShadows: false 
      }, 
      navigation: { 
        nextEl: ".swiper-button-next", 
        prevEl: ".swiper-button-prev", 
      }, 
      pagination: { 
        el: ".modal-swiper-pagination", 
        clickable: true 
      },
    });

    const video = swiperEl.querySelector('video');
    if (video) {
      // Funktio, joka toistaa videon vain aktiivisessa diassa
      const handleVideo = () => {
        const activeSlide = swiper.slides[swiper.activeIndex];
        if (activeSlide.contains(video)) {
          video.muted = true; // varmistetaan ettei ääni kuulu
          video.play(); // aloitetaan toisto
        } else {
          video.pause(); // pysäytetään video, jos se ei ole näkyvissä
          video.currentTime = 0; // palautetaan alkuun
        }
      };
      // Kutsutaan funktiota aina kun dia vaihtuu
      swiper.on('slideChange', handleVideo);
      handleVideo();
    }
    // Merkitään, että swiper on valmis (css hallinta näkyvyyteen)
    swiperEl.classList.add('swiper-ready');
  });


  //  HEADERIN NUOLI 

  const arrow = document.getElementById('scroll-arrow');
  if (arrow) {
    // Klikkaus piilottaa nuolen
    arrow.addEventListener('click', () => {
      arrow.style.display = 'none';
    });

    // Scrollaus piilottaa nuolen
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        arrow.style.display = 'none';
      }
    });
  }

});
