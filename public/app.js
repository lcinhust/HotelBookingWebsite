// Close the nav when the navlinks are clicked (mobile only)
let navList = document.querySelector('.nav-list');
let navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(function (navLink) {
    navLink.addEventListener('click', function () {
        navList.style.left = '-100%';
    })
});

// testimonial section
$('.slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
    arrows: false
});