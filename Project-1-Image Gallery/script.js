
// Select all gallery images
const galleryItems = document.querySelectorAll(".gallery-item");

// Select lightbox elements
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const caption = document.getElementById("image-caption");

const closeBtn = document.getElementById("close");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

// Filter buttons
const filterButtons = document.querySelectorAll(".filter-btn");

// Store currently visible images
let visibleImages = [];

// Current image position
let currentIndex = 0;


// Function to open an image
function openLightbox(index) {

    visibleImages = Array.from(galleryItems).filter(
        item => !item.classList.contains("hide")
    );

    currentIndex = index;

    showImage();

    lightbox.classList.add("show");
}


// Function to display image
function showImage() {

    const selectedItem = visibleImages[currentIndex];

    const image = selectedItem.querySelector("img");

    const title = selectedItem.querySelector("h3");

    lightboxImg.src = image.src;

    lightboxImg.alt = image.alt;

    caption.textContent = title.textContent;

}


// Open image when clicked
galleryItems.forEach(item => {

    item.addEventListener("click", () => {

        visibleImages = Array.from(galleryItems).filter(
            img => !img.classList.contains("hide")
        );

        const index = visibleImages.indexOf(item);

        openLightbox(index);

    });

});


// Next Image
nextBtn.addEventListener("click", () => {

    currentIndex++;

    if (currentIndex >= visibleImages.length) {
        currentIndex = 0;
    }

    showImage();

});


// Previous Image
prevBtn.addEventListener("click", () => {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = visibleImages.length - 1;
    }

    showImage();

});


// Close Lightbox
closeBtn.addEventListener("click", () => {

    lightbox.classList.remove("show");

});


// Close when clicking outside image
lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {
        lightbox.classList.remove("show");
    }

});


// Image Filters
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        // Remove active class from all buttons
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Activate clicked button
        button.classList.add("active");

        // Show or hide images
        galleryItems.forEach(item => {

            const category = item.dataset.category;

            if (filter === "all" || category === filter) {

                item.classList.remove("hide");

            } else {

                item.classList.add("hide");

            }

        });

    });

});


// Keyboard Navigation
document.addEventListener("keydown", (event) => {

    if (!lightbox.classList.contains("show")) {
        return;
    }

    if (event.key === "ArrowRight") {
        nextBtn.click();
    }

    if (event.key === "ArrowLeft") {
        prevBtn.click();
    }

    if (event.key === "Escape") {
        lightbox.classList.remove("show");
    }

});
