// ----------------------------------------------------------------------------------------------------
// header

const navItems = document.querySelectorAll(".nav-list");

navItems.forEach(item => {
    item.addEventListener("click", () => {

        // bỏ active ở các item khác
        navItems.forEach(i => i.classList.remove("active"));

        // thêm active cho item được click
        item.classList.add("active");
    });
});

const navHorizontal = document.getElementById("nav-horizontal");

window.addEventListener("scroll", () => {

    if (window.scrollY > 100) {
        navHorizontal.classList.add("scrolled");
    } else {
        navHorizontal.classList.remove("scrolled");
    }

});


// ----------------------------------------------------------------------------------------------------
// ngôn ngữ hiển thị

const languages = document.querySelectorAll(".language");

languages.forEach(language => {
    language.addEventListener("click", () => {

        languages.forEach(item =>
            item.classList.remove("active")
        );

        language.classList.add("active");
    });
});

// ----------------------------------------------------------------------------------------------------
// không download hình

// document.addEventListener("contextmenu", e => e.preventDefault());

// preview hình và tải hình ---------------------------------------------

const thumbnails = document.querySelectorAll(".pics img");

thumbnails.forEach(img => {
    img.loading = "lazy";
    img.decoding = "async";
    img.fetchPriority = "low";
});

const preview = document.querySelector(".preview-img");
const picInfo = document.querySelector(".pic-info");
const cancelBtn = document.querySelector(".cancel");
const downloadLink = document.getElementById("downloadLink");

const viewFullLink = document.getElementById("viewFullLink");

viewFullLink.addEventListener("click", (e) => {

    e.preventDefault();

    const photos = [...thumbnails].map(img => img.src);

    sessionStorage.setItem(
        "photos",
        JSON.stringify(photos)
    );

    sessionStorage.setItem(
        "photoIndex",
        currentPhotoIndex
    );

    window.location.href = "fullscreen.html";

});

let currentPhotoIndex = 0;
function showImage(img) {
    currentPhotoIndex = [...thumbnails].indexOf(img);

    preview.src = img.src;
    preview.alt = img.alt;

    currentPhotoIndex = [...thumbnails].indexOf(img);

    downloadLink.href = img.src;
    downloadLink.download = img.src.split("/").pop();

    thumbnails.forEach(item => item.classList.remove("active"));
    img.classList.add("active");

    picInfo.classList.remove("hidden");

    img.scrollIntoView({
        behavior: "smooth",
        block: "center",   // đưa ảnh vào giữa màn hình theo chiều dọc
        inline: "center"   // nếu có scroll ngang
    });
}

thumbnails.forEach(img => {
    img.addEventListener("click", () => {
        showImage(img);
    });
});

// data hình ---------------------------------------------

const photoDate = document.getElementById("photoDate");
const photoAuthor = document.getElementById("photoAuthor");
const photoEvent = document.getElementById("photoEvent");


const getPhotoInfo = src =>
    albums.find(album => album.photos.includes(src));

thumbnails.forEach(img => {

    img.addEventListener("click", () => {

        showImage(img);

        const info = getPhotoInfo(img.getAttribute("src")) || {};

        [
            [photoDate, info.date],
            [photoAuthor, info.author],
            [photoEvent, info.event]
        ].forEach(([el, value]) => {
            el.textContent = value || "";
        });

        [
            [dateRow, info.date],
            [authorRow, info.author],
            [eventRow, info.event]
        ].forEach(([row, value]) => {
            row.style.display = value ? "flex" : "none";
        });

    });

});

// tắt hình ---------------------------------------------

cancelBtn.addEventListener("click", () => {
    picInfo.classList.add("hidden");

    thumbnails.forEach(item => item.classList.remove("active"));
});

