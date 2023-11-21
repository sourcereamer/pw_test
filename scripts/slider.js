document.addEventListener("DOMContentLoaded", function () {
    var width = 720;
    var animationSpeed = 1000;
    var currentSlide = 1;
    var isAnimating = false;

    var slider = document.getElementById("slider");
    var slideContainer = slider.querySelector('.slides');
    var slides = slideContainer.querySelectorAll('.slide');
    var dots = document.querySelectorAll('.dot');

    var slidesArray = Array.from(slides);
    
    var firstSlideClone = slidesArray[0].cloneNode(true);
    firstSlideClone.style.display = 'block';
    var lastSlideClone = slidesArray[slidesArray.length - 1].cloneNode(true);
    lastSlideClone.style.display = 'block';
    lastSlideClone.classList.add('cloned-slide');
    slideContainer.insertBefore(lastSlideClone, slideContainer.firstChild);
    slideContainer.appendChild(firstSlideClone);
    
    slideContainer.style.marginLeft = -width + 'px';

    function showSlide(index) {
        if (isAnimating) {
            return;
        }

        isAnimating = true;

        var newPosition = -width * index;

        function animate() {
            var currentPosition = parseFloat(getComputedStyle(slideContainer).marginLeft);
            var startTime = performance.now();

            function step(currentTime) {
                var progress = (currentTime - startTime) / animationSpeed;

                if (progress < 1) {
                    var easeProgress = 1 - Math.pow(1 - progress, 2);
                    var newPositionValue = currentPosition + (newPosition - currentPosition) * easeProgress;
                    slideContainer.style.marginLeft = newPositionValue + 'px';
                    requestAnimationFrame(step);
                } else {
                    if (index >= slidesArray.length + 1) {
                        currentSlide = 1;
                        slideContainer.style.marginLeft = -width + 'px';
                    } else if (index < 1) {
                        currentSlide = slidesArray.length;
                        slideContainer.style.marginLeft = -(width * currentSlide) + 'px';
                    }
                    
                    slidesArray.forEach(function (slide) {
                        slide.classList.remove('current-slide');
                    });
                    
                    var visibleSlides = Array.from(slideContainer.querySelectorAll('.slide:not([style*="display: none"])'));
                    if (visibleSlides.length > 0) {
                        var currentVisibleIndex = (visibleSlides.indexOf(slidesArray[currentSlide - 1])) % visibleSlides.length;
                        visibleSlides[currentVisibleIndex].classList.add('current-slide');
                    }

                    updateDots();
                    isAnimating = false;
                }
            }

            requestAnimationFrame(step);
            currentSlide = index;
            slideContainer.style.marginLeft = -width * (currentSlide - 1) + 'px';
        }

        animate();
        currentSlide = index;
        slideContainer.style.marginLeft = -width * (currentSlide - 1) + 'px';
    }
    
    function updateDots() {
        dots.forEach(function (dot, index) {
            var dotIndex = (currentSlide - 1 - index) % slidesArray.length;
            dot.classList.toggle('active', dotIndex === 0);
        });
    }

    function plusSlides(n) {
        showSlide(currentSlide + n);

        if (!slideContainer.querySelector('.current-slide')) {
            var visibleSlides = Array.from(slideContainer.querySelectorAll('.slide:not([style*="display: none"])'));

            if (n > 0) {
                visibleSlides[1].classList.add('current-slide');
            } else {
                visibleSlides[visibleSlides.length - 2].classList.add('current-slide');
            }
        }
    }
    
    function currentSlideClick(index) {
        showSlide(index + 1); // Увеличиваем индекс, так как точки начинаются с 1
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            currentSlideClick(index);
        });
    });

    document.querySelector('.prev').addEventListener('click', function () {
        plusSlides(-1);
    });

    document.querySelector('.next').addEventListener('click', function () {
        plusSlides(1);
    });

    showSlide(currentSlide);

    document.querySelectorAll('.minus').forEach(function (minusButton) {
        minusButton.addEventListener('click', function () {
            var input = this.parentElement.querySelector('input');
            var count = parseInt(input.value) - 1;
            count = count < 1 ? 1 : count;
            input.value = count;
            input.dispatchEvent(new Event('change'));
            return false;
        });
    });

    document.querySelectorAll('.plus').forEach(function (plusButton) {
        plusButton.addEventListener('click', function () {
            var input = this.parentElement.querySelector('input');
            var count = parseInt(input.value) + 1;
            count = count > 10 ? 10 : count;
            input.value = count;
            input.dispatchEvent(new Event('change'));
            return false;
        });
    });
    
    document.querySelector('.slide__number input').addEventListener('change', function () {
        var count = parseInt(this.value);
        
        slidesArray.forEach(function (slide, index) {
            if (index >= count) {
                slide.style.display = 'none';
                dots[index].style.display = 'none';
            } else {
                slide.style.display = 'block';
                dots[index].style.display = 'inline-block';
            }
        });
        
        var clonedSlides = document.querySelectorAll('.cloned-slide');
        clonedSlides.forEach(function (clonedSlide) {
            slideContainer.removeChild(clonedSlide);
        });
        
        var newCloneIndex = count - 1;
        var newSlideClone = slidesArray[newCloneIndex].cloneNode(true);
        newSlideClone.style.display = 'block';
        newSlideClone.classList.add('cloned-slide');
        slideContainer.insertBefore(newSlideClone, slideContainer.firstChild);


        if (currentSlide !== 1) {
            slideContainer.style.marginLeft = -width + 'px';
        }
        
        showSlide(1);

        if (parseFloat(slideContainer.style.marginLeft) < -width*count) {
            slideContainer.style.marginLeft = -width + 'px';
        }
    });
});