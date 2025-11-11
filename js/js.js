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

  // Haetaan modaali  ja sen body
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('projectModalBody');

  // Muuttuja, jolla pidetään kirjaa siitä, mikä projekti on jo ladattu,
  // jotta samaa ei ladata uudelleen turhaan
  let loadedProject = null;

  // Kun modaali avataan
  modal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget; // Haetaan painike elementti, joka avasi modaalin
    const project = button.getAttribute('data-project'); // Otetaan siitä data-attribuutista projektiin liittyvä tunniste
    if (!project) return; // Jos attribuuttia ei ole, poistutaan
    if (loadedProject === project) return; // Jos sama projekti on jo ladattu, ei ladata uudelleen

    loadedProject = project; // Tallennetaan ladattu projekti muistiin
    modalBody.innerHTML = '<p class="text-white">Ladataan sisältöä...</p>';

    // Haetaan projektin sisältö erillisestä HTML-tiedostosta
    fetch(`projects/${project}.html`)
      .then(response => {
        if (!response.ok) throw new Error('Projektia ei löytynyt');
        return response.text(); // Palautetaan HTML-sisältö tekstinä
      })
      .then(html => {
        modalBody.innerHTML = html;  // Asetetaan ladattu HTML sisällöksi modaalin body-osaan
      })
      .catch(() => {
        modalBody.innerHTML = '<p class="text-danger">Sisältöä ei voitu ladata.</p>'; // Jos lataus epäonnistuu, näytetään virheilmoitus
      });
  });

  // Kun modaali on täysin näkyvissä
  modal.addEventListener('shown.bs.modal', () => {
    // Modaalin swiper karuselli
    const swiperEl = modal.querySelector('.modal-swiper');
    if (!swiperEl) return;

    // Tarkistetaan onko swiperilla single-slide luokka (karuselissa näkyy vain yksi dia kerrallaan)
    const isSingleSlide = swiperEl.classList.contains('single-slide');

    const swiper = new Swiper(swiperEl, {
      // Vaihdetaan efekti luokan mukaan
      effect: isSingleSlide ? "fade" : "coverflow",
      grabCursor: false,
      centeredSlides: true,
      allowTouchMove: true,
      // Vaihdetaan diojen määrrä luokan mukaan
      slidesPerView: isSingleSlide ? 1 : 'auto',
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

  // Videoiden hallinta swiperissä jos sellainen on
  const video = swiperEl.querySelector('video');

  if (video) { // Jos video löytyy, suoritetaan videon hallintalogiikka

    // Funktio, joka käynnistää tai pysäyttää videon sen mukaan, onko se aktiivisessa diassa
    function handleVideo() {
      // Selvitetään, mikä dia on tällä hetkellä aktiivinen
      const activeSlide = swiper.slides[swiper.activeIndex];

      // Jos aktiivinen dia on video
      if (activeSlide.contains(video)) {
        video.muted = true;   // Varmistetaan, että video on mykistetty (
        video.play();         // Toistetaan video
      } else {
        video.pause();        // Pysäytetään video, jos se ei ole aktiivinen
        video.currentTime = 0; // Nollataan toisto, jotta se alkaa alusta kun se näkyy uudelleen
      }
    }

  // Aina kun dia vaihtuu, suoritetaan handleVideo()
  swiper.on('slideChange', handleVideo);

  // Suoritetaan handleVideo heti, kun modaali avataan ja Swiper alustetaan
  handleVideo();
}

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
