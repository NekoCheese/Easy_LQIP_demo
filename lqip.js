const lazyImages = document.querySelectorAll(".lazy");

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      const src = img.dataset.src;

      // 載入完成後切換效果
      img.onload = () => {
        img.classList.add("lazy-out");
        img.classList.remove("lazy");
      };

      img.setAttribute("src", src);

      observer.unobserve(img);
    }
  });
});

lazyImages.forEach((image) => {
  observer.observe(image);
});
