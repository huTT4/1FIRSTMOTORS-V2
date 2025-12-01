// ============================== Переключение языка ==============================
let langList = null

document.addEventListener('click', (e) => {
  const langButton = e.target.closest('.lang')
  const langList = e.target.closest('.lang__list')
  const langLink = e.target.closest('.lang__list-link')

  // Если кликнули по кнопке языка
  if (langButton) {
    const container = langButton.closest('.langs')
    const list = container.querySelector('.lang__list')
    list.classList.toggle('active')
  }

  // Если кликнули по ссылке в списке
  else if (langLink) {
    const list = langLink.closest('.lang__list')
    list.classList.remove('active')
  }

  // Если кликнули вне области языкового меню 
  else if (!langList) {
    document.querySelectorAll('.lang__list.active').forEach(list => {
      list.classList.remove('active')
    })
  }
})

// ============================== Кнопка для скролла(ARROW TO TOP) ==============================
const arrowToTop = document.querySelector('.arrow__to-top')

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 200) {
    arrowToTop.classList.add('show')
  } else {
    arrowToTop.classList.remove('show')
  }
})

arrowToTop.addEventListener('click', function (e) {
  e.preventDefault()
  window.scrollTo({ top: 0 })
})

// ============================== Бургер - меню ==============================
const burger = document.querySelector('.burger')
const nav = document.querySelector('.header__content')
const burgerLinks = document.querySelectorAll('.header__nav a')

burger.addEventListener('click', () => {
  burger.classList.toggle('active')
  nav.classList.toggle('active')
})

burgerLinks.forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active')
    nav.classList.remove('active')
  })
})

// ============================== Валидация формы ==============================

const lang = document.documentElement.getAttribute('lang')

const messages = {
  ru: {
    required: 'Это поле обязательно для заполнения.',
    email: 'Введите корректный адрес электронной почты.',
    captcha: 'Пройдите reCAPTCHA.',
    success: 'Сообщение успешно отправлено.',
    failed: 'Сообщение не отправлено, попробуйте ещё раз.'
  },

  lv: {
    required: 'Šis lauks ir obligāts aizpildīšanai.',
    email: 'Ievadiet derīgu e-pasta adresi.',
    captcha: 'Pabeidziet reCAPTCHA',
    success: 'Ziņojums veiksmīgi nosūtīts.',
    failed: 'Ziņojumu neizdevās nosūtīt, lūdzu, mēģiniet vēlreiz.'
  },

  en: {
    required: 'This field is required.',
    email: 'Please enter a valid email address.',
    captcha: 'Complete reCAPTCHA.',
    success: 'Message sent successfully.',
    failed: 'Message not sent, please try again.'
  }
}

let msg = messages.ru

switch (lang) {
  case 'ru':
    msg = messages.ru
    break
  case 'lv':
    msg = messages.lv
    break
  case 'en':
    msg = messages.en
    break
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateForm(form) {
  let isValid = true
  const inputs = form.querySelectorAll('input[name], textarea[name]')

  // Сброс предыдущих ошибок
  const errorElements = form.querySelectorAll('.error-message')
  errorElements.forEach(el => el.remove())

  inputs.forEach(input => {
    const value = input.value.trim()
    const name = input.getAttribute('name')
    const formGroup = input.closest('.form-group')

    if (!formGroup) return

    // Проверка обязательных полей
    if (input.hasAttribute('required') && !value) {
      showError(formGroup, msg.required)
      isValid = false
      return
    }

    // Проверка email
    if (name === 'email' && value && !validateEmail(value)) {
      showError(formGroup, msg.email)
      isValid = false
    }

    // Проверка reCAPTCHA
    if (name === 'g-recaptcha-response') {
      const recaptchaResponse = grecaptcha.getResponse()
      if (!recaptchaResponse) {
        showError(formGroup, msg.captcha)
        isValid = false
      }
    }
  })

  return isValid
}

function showError(formGroup, message) {
  const errorElement = document.createElement('div')
  errorElement.className = 'error-message'
  errorElement.style.color = 'red'
  errorElement.style.marginTop = '5px'
  errorElement.textContent = message
  formGroup.appendChild(errorElement)
}

function serializeForm(form) {
  const formData = new FormData(form)
  const params = new URLSearchParams()

  for (const [key, value] of formData.entries()) {
    params.append(key, value)
  }

  return params.toString()
}

function handleFormSubmit(event) {
  event.preventDefault()

  const form = event.target
  const notification = document.querySelector('.form-notification')
  const preloader = document.querySelector('.preloader')

  if (!validateForm(form)) return

  const formData = serializeForm(form)

  // Показать прелоадер
  if (preloader) preloader.style.display = 'block'

  fetch('../php/sendEmail.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  })
    .then(response => response.text())
    .then(data => {
      data = data.trim()
      if (notification) {
        notification.style.display = 'block'
        if (data === 'success') {
          notification.textContent = msg.success
          setTimeout(() => window.location.href = '', 5000)
        } else if (data === 'captcha') {
          notification.textContent = msg.captcha
        } else {
          notification.textContent = msg.failed
        }
      }
    })
    .catch(error => {
      if (notification) {
        notification.style.display = 'block'
        notification.textContent = msg.failed
      }
      console.error('Error:', error)
    })
    .finally(() => {
      // Скрыть прелоадер
      if (preloader) preloader.style.display = 'none'
    })
}

// Инициализация формы
document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.querySelector('.contact-form')
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit)
  }
})

// ============================== Отключаем возможность перехода по ссылке в форме ==============================
const formLinks = document.querySelectorAll('.form__checkbox a')
formLinks.forEach(link => link.addEventListener('click', e => e.preventDefault()))
