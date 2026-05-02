const letterQuotes = [
  "Дорогая Полина Ивановна! Поздравляем вас с Международным Женским Днем 8 Марта! Желаем вам крепкого здоровья, долгих лет жизни, много радости, бодрости и отличного настроения. С уважением, семья Ягутиловых.",
  "Дорогая Полина Ивановна! Сердечно поздравляем с праздником Великого Октября. Желаем всего самого наилучшего. У нас всё нормально. Городиянские. Большой привет всем.",
  "Дорогая, добрая, сердечная Полина Ивановна! С весенним праздником! Самые добрые пожелания Вам и Вашей семье в жизни. Доброго здоровья и человеческого счастья. С уважением к Вам Евдокия Федоровна и Максим Афанасьевич",
  "Дорогие наши Полина Ивановна Аллочка, Вася и Сашик. Поздравляем вас с наступающим Новым 1981 годом. Желаем вам всего самого прекрасного в жизни, успехов в труде, здоровья и семейного благополучия. Целуем Катя Гена.",
  "Дорогая, Полина Ивановна! Великая вы труженица! –Поздравляю я Вас с наступающим праздником Великого Октября! Пусть у вас будет счастье и здоровье еще долгие годы, чтобы внуки помнили свою бабушку, чтобы потом рассказывать о них своим детям. Очень жаль, что часто бабушки не доживают до сознательной жизни внуков. Может быть Вам повезет, Полина Ивановна, и они поймут, как хорошо, что у нас есть бабушка! Будьте счастливы. Обнимаю целую Роза 28\\10.81г",
  "Дорогая Полина Ивановна! Поздравляем Вас с праздником, желаем крепкого здоровья, долгих лет жизни и всего наилучшего в жизни. С уважением к Вам Сваха и Мараковы",
  "Уважаемая Полина Ивановна! Поздравляем Вас с праздником Великого Октября, желаем доброго здоровья, счастья, мира. Павел, Люся, Наташа, Вадим.",
  "Дорогая Полина Ивановна! Поздравляем вас с праздником Великого Октября Желаем вам доброго здоровья, долгих лет жизни и всего наилучшего в жизни целуем Гена, Шура.",
  "Дорогая Полина Ив. Поздравляем Вас с 64 годов. В. О.  Ср желаем Вам здоров. Счастья и благополучия на долгие годы. Привет А.С. целую А В",
  "Дорогая Полина Ивановна! Сердечно поздравляем Вас с наступающим праздником! Желаем Вам крепкого здоровья, радости, бодрости. Целуем, Клосевы"
];

const imageFiles = [
  "src/images/03230-1.jpg",
  "src/images/03230-2.jpg",
  "src/images/03230-3.jpg",
  "src/images/03230-4.jpg",
  "src/images/03231-1.jpg",
  "src/images/03231-2.jpg",
  "src/images/03232-1.jpg",
  "src/images/03232-2.jpg",
  "src/images/03233-1.jpg",
  "src/images/03233-2.jpg",
  "src/images/03234-1.jpg",
  "src/images/03234-2.jpg",
  "src/images/03234-3.jpg",
  "src/images/03234-4.jpg",
  "src/images/03235-1.jpg",
  "src/images/03235-2.jpg",
  "src/images/03236-1.jpg",
  "src/images/03236-2.jpg",
  "src/images/03237-1.jpg",
  "src/images/03237-2.jpg",
  "src/images/03238-1.jpg",
  "src/images/03238-2.jpg",
  "src/images/03239-1.jpg",
  "src/images/03239-2.jpg"
];

const groupedImages = Object.entries(
  imageFiles.reduce((groups, path) => {
    const fileName = path.split("/").pop() || "";
    const [groupKey, indexPart] = fileName.replace(".jpg", "").split("-");
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    groups[groupKey].push({
      path,
      order: Number(indexPart) || 999
    });
    return groups;
  }, {})
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([groupKey, files]) => ({
    groupKey,
    files: files.sort((a, b) => a.order - b.order).map((item) => item.path)
  }));

const lettersRoot = document.getElementById("letters");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

groupedImages.forEach((group, index) => {
  const quote = letterQuotes[index % letterQuotes.length];
  const stackType = Math.min(group.files.length, 4);
  const imagesMarkup = group.files
    .map((imgPath, imgIndex) => {
      const imgClass = imgIndex === 0 ? "is-main" : "";
      return `<img class="${imgClass}" src="${imgPath}" alt="Письмо ${group.groupKey}-${imgIndex + 1}" loading="lazy" />`;
    })
    .join("");

  const card = document.createElement("article");
  card.className = "letter-card";
  card.innerHTML = `
    <div class="stack stack--${stackType}">
      ${imagesMarkup}
    </div>
    <blockquote>
      "${quote}"
      <footer>Из поздравительных писем</footer>
    </blockquote>
  `;
  lettersRoot.appendChild(card);
  observer.observe(card);
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeBtn = document.getElementById("lightboxClose");
const prevBtn = document.getElementById("lightboxPrev");
const nextBtn = document.getElementById("lightboxNext");
const scrollTopBtn = document.getElementById("scrollTopBtn");

let activeGroupImages = [];
let activeImageIndex = 0;
let swipeStartX = 0;
let swipeStartY = 0;
const swipeThresholdX = 50;
const swipeMaxOffsetY = 70;

function renderLightboxImage(direction = "none") {
  const current = activeGroupImages[activeImageIndex];
  if (!current) {
    return;
  }

  lightboxImage.classList.remove("swipe-next", "swipe-prev");
  lightboxImage.src = current.src;
  lightboxImage.alt = current.alt;

  if (direction === "next" || direction === "prev") {
    void lightboxImage.offsetWidth;
    lightboxImage.classList.add(direction === "next" ? "swipe-next" : "swipe-prev");
  }

  const hasNavigation = activeGroupImages.length > 1;
  prevBtn.disabled = !hasNavigation;
  nextBtn.disabled = !hasNavigation;
}

function openLightbox(images, startIndex) {
  activeGroupImages = images;
  activeImageIndex = startIndex;
  renderLightboxImage();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lightboxImage.src = "";
  activeGroupImages = [];
  activeImageIndex = 0;
}

function showPrevImage() {
  if (activeGroupImages.length < 2) {
    return;
  }
  activeImageIndex = (activeImageIndex - 1 + activeGroupImages.length) % activeGroupImages.length;
  renderLightboxImage("prev");
}

function showNextImage() {
  if (activeGroupImages.length < 2) {
    return;
  }
  activeImageIndex = (activeImageIndex + 1) % activeGroupImages.length;
  renderLightboxImage("next");
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLImageElement && target.closest(".stack")) {
    const stackImages = Array.from(target.closest(".stack").querySelectorAll("img"));
    const currentIndex = stackImages.indexOf(target);
    const mappedImages = stackImages.map((img) => ({ src: img.src, alt: img.alt }));
    openLightbox(mappedImages, currentIndex);
  }
});

closeBtn.addEventListener("click", closeLightbox);
prevBtn.addEventListener("click", showPrevImage);
nextBtn.addEventListener("click", showNextImage);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowLeft") {
    showPrevImage();
  } else if (event.key === "ArrowRight") {
    showNextImage();
  }
});

lightbox.addEventListener(
  "touchstart",
  (event) => {
    if (!lightbox.classList.contains("open") || activeGroupImages.length < 2 || event.touches.length !== 1) {
      return;
    }

    swipeStartX = event.touches[0].clientX;
    swipeStartY = event.touches[0].clientY;
  },
  { passive: true }
);

lightbox.addEventListener(
  "touchend",
  (event) => {
    if (!lightbox.classList.contains("open") || activeGroupImages.length < 2 || event.changedTouches.length !== 1) {
      return;
    }

    const deltaX = event.changedTouches[0].clientX - swipeStartX;
    const deltaY = event.changedTouches[0].clientY - swipeStartY;

    if (Math.abs(deltaX) < swipeThresholdX || Math.abs(deltaY) > swipeMaxOffsetY) {
      return;
    }

    if (deltaX < 0) {
      showNextImage();
    } else {
      showPrevImage();
    }
  },
  { passive: true }
);

window.addEventListener("scroll", () => {
  if (window.scrollY > 420) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
