const elements = {
  root: document.querySelector('.root'),
  content: document.querySelector('.main-content'),
  popupContacts: document.querySelector('.popup__contacts'),
  popupSuccess: document.querySelector('.popup__success'),
  popupBurger: document.querySelector('.popup__burger'),
  headerMenu: document.querySelector('.header__menu'),
  heroFixed: document.querySelector('.hero'),
  mainError: document.querySelector('.popup__contacts-container-required-all'),
  popupPhone: document.querySelector('.popup__contacts-phone'),
  buttons: {
    sales: document.querySelectorAll('.header__button, .hero__container-text-button, .business__headline-button, .popup__contacts-button_submit, .footer__button, .popup__burger-button'),
    closePopup: document.querySelectorAll('.popup__contacts-button_close, .popup__success-button, .popup__success-button_close'),
    closePopupCookies: document.querySelectorAll('.popup__cookies-button_close, .popup__cookies-form-button_accept, .popup__cookies-form-button_decline'),
    burger: document.querySelector('.popup__burger-button'),
    burgerOpened: document.querySelector('.header__menu-burger'),
    burgerClose: document.querySelector('.popup__burger-button_close'),
    submitButton: document.querySelector('.popup__contacts-button_submit'),
    submitForm: document.querySelector('.popup__contacts-form'),
    successForm: document.querySelector('.popup__success'),
  },
  inputs: {
    required: document.querySelectorAll('.popup__contacts-container-input[required], .popup__contacts-phone[required]'),
    errors: document.querySelectorAll('.popup__contacts-container-required'),
  },
};

function addClass(element, className) {
  element.classList.add(className);
}

function removeClass(element, className) {
  element.classList.remove(className);
}

function openPopup() {
  addClass(elements.popupContacts, 'popup_active');
  addClass(elements.root, 'root_scroll-disable');
  addClass(elements.content, 'main-content_shadowed');
}

function closePopup() {
  removeClass(elements.popupSuccess, 'popup_active');
  removeClass(elements.popupContacts, 'popup_active');
  removeClass(elements.root, 'root_scroll-disable');
  removeClass(elements.content, 'main-content_shadowed');
}

elements.buttons.sales.forEach(button => button.addEventListener('click', openPopup));
elements.buttons.closePopup.forEach(button => button.addEventListener('click', closePopup));

elements.buttons.burgerOpened.addEventListener('click', () => {
  addClass(elements.popupBurger, 'popup_active');
  addClass(elements.root, 'root_scroll-disable');
});

elements.buttons.burgerClose.addEventListener('click', () => {
  removeClass(elements.popupBurger, 'popup_active');
  removeClass(elements.root, 'root_scroll-disable');
});

elements.buttons.burger.addEventListener('click', () => removeClass(elements.popupBurger, 'popup_active'));

function validateForm() {
  let formIsValid = true;

  elements.inputs.required.forEach((input, index) => {
    if (input.value.trim() === '') {
      elements.inputs.errors[index].style.display = 'block';
      formIsValid = false;
    } else {
      elements.inputs.errors[index].style.display = 'none';
    }
  });

  return formIsValid;
}

elements.inputs.required.forEach((input, index) => {
  input.addEventListener('blur', () => {
    if (input.value.trim() === '') {
      elements.inputs.errors[index].style.display = 'block';
    } else {
      elements.inputs.errors[index].style.display = 'none';
    }
  });
});

elements.inputs.required.forEach(input => {
  input.addEventListener('input', (event) => {
    const formIsValid = validateForm();

    if (formIsValid) {
      event.preventDefault();
      removeClass(elements.buttons.submitButton, 'popup__contacts-button_inactive');
      elements.mainError.style.display = 'none';
    } else {
      addClass(elements.buttons.submitButton, 'popup__contacts-button_inactive');
      elements.mainError.style.display = 'block';
    }

    input.style.border = input.value.trim() === '' ? '1px solid #EC1211' : '1px solid #F1F1F1';
  });
});

elements.buttons.submitForm.addEventListener('submit', (event) => {
  event.preventDefault();
  closePopup();
  addClass(elements.buttons.successForm, 'popup_active');
});

window.addEventListener('scroll', () => {
  const headerNav = document.querySelector('.header__nav');
  const headerNavHeight = headerNav.offsetHeight;

  if (window.scrollY > headerNavHeight) {
    addClass(elements.headerMenu, 'header__menu_fixed');
    addClass(elements.heroFixed, 'hero_fixed');
  } else {
    removeClass(elements.headerMenu, 'header__menu_fixed');
    removeClass(elements.heroFixed, 'hero_fixed');
  }
});

elements.buttons.closePopupCookies.forEach((button) => {
  button.addEventListener('click', () => {
    const popupClosedCookies = document.querySelector('.popup__cookies');
    removeClass(popupClosedCookies, 'popup__cookies_active');
  });
});

function formatPhoneNumber(input) {
  var phoneNumber = input.value.replace(/\D/g, '');
  var formattedPhoneNumber = '+7 (' + phoneNumber.substring(1, 4) + ') ' + phoneNumber.substring(4, 7) + '-' + phoneNumber.substring(7, 9) + '-' + phoneNumber.substring(9, 11);

  var cursorPosition = input.selectionStart;
  input.value = formattedPhoneNumber;
  var newPosition = cursorPosition + (formattedPhoneNumber.length - phoneNumber.length);
  input.setSelectionRange(newPosition, newPosition);
}
