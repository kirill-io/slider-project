export default class Slider {
  constructor(
    {
      sliderListSelector,
      sliderItemSelector,
      prevButtonSelector,
      nextButtonSelector,
      dotSelector,
      dotActiveClass,
      animationDelay,
    }
  ) 
  {
    this._sliderList = document.querySelector(sliderListSelector);
    this._originalItems = [...document.querySelectorAll(sliderItemSelector)];
    this._prevButton = document.querySelector(prevButtonSelector);
    this._nextButton = document.querySelector(nextButtonSelector);
    this._dots = document.querySelectorAll(dotSelector);
    this._dotActiveClass = dotActiveClass;
    this._animationDelay = animationDelay;
    this._isTransitioning = false;
    this.#init();
    this.#setEventListeners();
  }

  #calculateSlideWidth() {
    const itemWidth = this._originalItems[0].getBoundingClientRect().width;
    const sliderStyles = getComputedStyle(this._sliderList);
    const gap = parseInt(sliderStyles.gap || '0', 10);
    this._slideWidth = itemWidth + gap;   
  }

  #cloneSlidesToEnd() {
    this._originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      this._sliderList.appendChild(clone);
    });
  }

  #cloneSlidesToStart() {
    const clonesForStart = this._originalItems.map(item => {
      const clone = item.cloneNode(true);
      return clone;
    });
    clonesForStart.reverse().forEach(clone => {
      this._sliderList.prepend(clone);
    });
  }

  #setInitialPosition() {
    this._originalLength = this._originalItems.length;
    this._currentIndex = this._originalLength;
    this._sliderList.style.transform = `translateX(-${this._slideWidth * this._currentIndex}px)`;
  }

  #initDotTransitions() {
    this._dots.forEach(dot => {
      dot.style.transition = `background-color ${this._animationDelay}ms ease-in-out`;
    });
  }

  #updateDots() {
    this._dots.forEach(dot => dot.classList.remove(this._dotActiveClass));
    const active = this._currentIndex % this._originalLength;
    this._dots[active]?.classList.add(this._dotActiveClass);
  }

  #updateSlider() {
    this._sliderList.style.transition = `transform ${this._animationDelay}ms ease-in-out`;
    this._sliderList.style.transform = `translateX(-${this._slideWidth * this._currentIndex}px)`;
    this.#updateDots();
  }

  #goToNextSlide() {
    this._nextButton.addEventListener('click', () => {
      if (this._isTransitioning) return;
      this._isTransitioning = true;
      this._currentIndex++;
      this.#updateSlider();
    });
  }

  #goToPrevSlide() {
    this._prevButton.addEventListener('click', () => {
      if (this._isTransitioning) return;
      this._isTransitioning = true;
      this._currentIndex--;
      this.#updateSlider();
    });
  }

  #handleTransitionEnd() {
    this._sliderList.addEventListener('transitionend', () => {
      if (this._currentIndex >= this._originalLength * 2) {
        this._sliderList.style.transition = 'none';
        this._currentIndex = this._originalLength;
        this._sliderList.style.transform = `translateX(-${this._slideWidth * this._currentIndex}px)`;
      }
    
      if (this._currentIndex < this._originalLength) {
        this._sliderList.style.transition = 'none';
        this._currentIndex = this._originalLength * 2 - 1;
        this._sliderList.style.transform = `translateX(-${this._slideWidth * this._currentIndex}px)`;
      }
    
      this._isTransitioning = false;
      this.#updateDots();
    });
  }

  #handleDotClicks() {
    this._dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (this._isTransitioning) return;
        this._isTransitioning = true;
        this._currentIndex = this._originalLength + index;
        this.#updateSlider();
      });
    });
  }

  #init() {
    this.#calculateSlideWidth();
    this.#cloneSlidesToEnd();
    this.#cloneSlidesToStart();
    this.#setInitialPosition();
    this.#initDotTransitions();
  }

  #setEventListeners() {
    this.#goToNextSlide();
    this.#goToPrevSlide();
    this.#handleTransitionEnd();
    this.#handleDotClicks();
  }
}