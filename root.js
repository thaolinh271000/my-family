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
const preview = document.querySelector(".preview-img");
const picInfo = document.querySelector(".pic-info");
const cancelBtn = document.querySelector(".cancel");
const downloadLink = document.getElementById("downloadLink");

function showImage(img) {
    preview.src = img.src;
    preview.alt = img.alt;

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

// showImage(thumbnails[0]);

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

// view full hình ảnh ---------------------------------------------

const popup = document.querySelector(".fullscreen-popup");

const wrapperMain =
    document.querySelector(".fullscreenSwiper .swiper-wrapper");

const wrapperThumb =
    document.querySelector(".thumbSwiper .swiper-wrapper");

wrapperMain.innerHTML = "";
wrapperThumb.innerHTML = "";

thumbnails.forEach(img => {

    wrapperMain.innerHTML += `
        <div class="swiper-slide">
            <img src="${img.src}">
        </div>
    `;
    wrapperThumb.innerHTML += `
        <div class="swiper-slide">
            <img src="${img.src}">
        </div>
    `;

});

const thumbSwiper = new Swiper(".thumbSwiper", {
    loop: true,
    slidesPerView: "auto",
    spaceBetween: 12,
    watchSlidesProgress: true,
    freeMode: {
        enabled: true,
        momentum: true
    },

    simulateTouch: true,
    allowTouchMove: true,
    grabCursor: true,
    mousewheel: true,
});

const fullSwiper = new Swiper(".fullscreenSwiper", {

    loop: true,

    loopAdditionalSlides: thumbnails.length,

    observer: true,
    observeParents: true,

    keyboard: {
        enabled: true,
        onlyInViewport: false,
        pageUpDown: false
    },

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
    },

    thumbs: {
        swiper: thumbSwiper
    }

});

fullSwiper.on("slideChange", () => {
    thumbSwiper.slideTo(fullSwiper.realIndex);
});

const viewBtn =
    document.querySelector(".viewfull-btn");

viewBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const activeIndex = [...thumbnails].findIndex(img =>
        img.classList.contains("active")
    );

    popup.classList.add("active");

    fullSwiper.keyboard.enable();

    setTimeout(() => {

        thumbSwiper.updateSize();
        thumbSwiper.updateSlides();
        thumbSwiper.update();
        fullSwiper.update();

        fullSwiper.slideToLoop(activeIndex);
        thumbSwiper.slideTo(activeIndex);

        popupDownload.href = preview.src;

    }, 0);

    console.log(
        "activeIndex:", activeIndex,
        "realIndex:", fullSwiper.realIndex,
        "active:", fullSwiper.activeIndex
    );
});

document.querySelector(".back-btn")
    .addEventListener("click", () => {
        popup.classList.remove("active");
        fullSwiper.keyboard.disable();
    });