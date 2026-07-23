/*
  Room II image viewer
  The links still open the original files when JavaScript or <dialog> is unavailable.
*/
const imageLinks = Array.from(document.querySelectorAll(".practice-image-link"));
const viewer = document.querySelector(".image-viewer");

if (viewer && typeof viewer.showModal === "function") {
  const viewerImage = viewer.querySelector(".viewer-image");
  const viewerTitle = viewer.querySelector("#viewer-title");
  const viewerSeries = viewer.querySelector(".viewer-series");
  const viewerCount = viewer.querySelector(".viewer-count");
  const closeButton = viewer.querySelector(".viewer-close");
  const previousButton = viewer.querySelector(".viewer-previous");
  const nextButton = viewer.querySelector(".viewer-next");
  let currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + imageLinks.length) % imageLinks.length;
    const link = imageLinks[currentIndex];
    const thumbnail = link.querySelector("img");

    viewerImage.src = link.href;
    viewerImage.alt = thumbnail.alt;
    viewerTitle.textContent = link.dataset.title;
    viewerSeries.textContent = link.dataset.series;
    viewerCount.textContent = `${currentIndex + 1} of ${imageLinks.length}`;
  }

  imageLinks.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showImage(index);
      viewer.showModal();
    });
  });

  closeButton.addEventListener("click", () => viewer.close());
  previousButton.addEventListener("click", () => showImage(currentIndex - 1));
  nextButton.addEventListener("click", () => showImage(currentIndex + 1));

  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) {
      viewer.close();
    }
  });

  viewer.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      showImage(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
      showImage(currentIndex + 1);
    }
  });
}
