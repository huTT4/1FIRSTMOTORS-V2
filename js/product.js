import cars from './cars.js'

// ============================== Показываем конкретную машину ==============================
// Получаем параметры из URL
const params = new URLSearchParams(window.location.search)
const carId = params.get('id')
const lang = document.documentElement.getAttribute('lang')

// Выбираем массив машин для текущего языка
const carsByLang = cars[lang]

// Ищем конкретную машину
const car = carsByLang.find(c => String(c.id) === carId)

if (!car) {
  console.error('Car not found')
} else {
  // Слева
  const mainImgWrapper = document.querySelector('.product__slider')
  const paginationWrapper = document.querySelector('.product__pagination')
  mainImgWrapper.innerHTML = ''
  paginationWrapper.innerHTML = ''

  car.imgs.forEach(img => {
    mainImgWrapper.innerHTML += `<img class="product__card-img" src="${img}" alt="car-img" data-fancybox="gallery">`
    paginationWrapper.innerHTML += `<div><img src="${img}" alt="car-img"></div>`
  })

  // Информационные плашки
  const infoWrapper = document.querySelector('[data-car-info]')

  infoWrapper.innerHTML = `
    ${car.isSold ? `<span class="product__card-img-info-sold">SOLD</span>` : ''}
    ${car.isNew ? `<span class="product__card-img-info-new">NEW</span>` : ''}
    ${car.discount > 0 ? `<span class="product__card-img-info-discount">
      <img src="../img/percent.svg" alt="percent"> -${car.discount}€
    </span>` : ''}
    ${car.availability ? `<span class="product__card-img-info-availability">
      <img src="../img/check-mark.svg" alt="check-mark">
      ${car.availability}
    </span>` : ''}
  `

  // Ссылки
  const linksContainer = document.querySelector('.product__links')
  const videoLink = document.querySelector('[data-car-link-video]')
  const reportLink = document.querySelector('[data-car-link-report]')

  // Видео
  if (car.linkVideo && car.linkVideo.trim() !== '') {
    videoLink.href = car.linkVideo
    videoLink.style.display = 'flex'
  } else {
    videoLink.style.display = 'none'
  }

  // Отчет
  if (car.linkReport && car.linkReport.trim() !== '') {
    reportLink.href = car.linkReport
    reportLink.style.display = 'flex'
  } else {
    reportLink.style.display = 'none'
  }

  if ((car.linkVideo && car.linkVideo.trim() !== '') && (car.linkReport && car.linkReport.trim() !== '')) {
    linksContainer.style.display = 'flex'
  } else {
    linksContainer.style.display = 'none'
  }

  // Справа
  document.querySelector('[data-car-title]').textContent = car.title
  document.querySelector('[data-car-price]').textContent = car.price.toLocaleString('ru-RU') + ' €'
  document.querySelector('[data-car-leasing]').textContent = car.leasing + '€'

  const infoSpans = document.querySelectorAll('.product__info li span')
  infoSpans[0].textContent = car.year
  infoSpans[1].textContent = car.mileage.toLocaleString('ru-RU')
  infoSpans[2].textContent = car.article
  infoSpans[3].textContent = car.transmission
  infoSpans[4].textContent = car.engine
  infoSpans[5].textContent = car.vin

  if (car.isSold) {
    document.querySelector('[data-car-price]').innerHTML = `<b>${lang === 'ru' ? 'Продано' : lang === 'lv' ? 'Pārdots' : 'Sold'}</b>`
    document.querySelector('.product__price-left-info').style.display = 'none'
    document.querySelector('.product__price-right').style.display = 'none'
  }

  // Описание
  document.querySelector('.product__descr').innerHTML = car.descr

  renderRelatedCars(carId, lang)
}

function createCatalogCard(car) {
  return `
      <div class="catalog__card-wrapper catalog__card-wrapper--product">
        <a href="/product/${lang === 'ru' ? 'ru.html' : lang === 'lv' ? 'index.html' : 'eng.html'}?id=${car.id}" class="catalog__card">
          <div class="catalog__card-img-wrapper">
            <img class="catalog__card-img" src="${car.mainImg}" alt="car-img">

            <div class="catalog__card-img-info">
              ${car.isSold ? `<span class="catalog__card-img-info-sold">SOLD</span>` : ''}
              ${car.isNew ? `<span class="catalog__card-img-info-new">NEW</span>` : ''}
              ${car.discount > 0 ? `<span class="catalog__card-img-info-discount">
                <img src="../img/percent.svg" alt="percent">-${car.discount}€
              </span>` : ''}
              ${car.availability ? `<span class="catalog__card-img-info-availability">
                <img src="../img/check-mark.svg" alt="check-mark">
                ${car.availability}
              </span>` : ''}
            </div>

            <span class="catalog__card-img-article">${car.article}</span>
          </div>

          <div class="catalog__card-title">
            <h5>${car.title}</h5>
          </div>

          <div class="catalog__card-info">
            <span><img src="../img/calendar-2.svg" alt="calendar">${car.year}</span>
            <span><img src="../img/transmission.svg" alt="transmission">${car.transmission}</span>
            <span><img src="../img/speedometer.svg" alt="speedometer">${car.mileage.toLocaleString('ru-RU')}</span>
            <span><img src="../img/engine.svg" alt="engine">${car.engine}</span>
          </div>

          ${car.isSold ? `<div class="catalog__card-price">
            <h6>${lang === 'ru' ? 'Продано' : lang === 'lv' ? 'Pārdots' : 'Sold'}</h6>
            <div class="hidden">
              ${lang === 'ru' ? 'Лизинг от' : lang === 'lv' ? 'Līzings no' : 'Leasing from'}
              <span>${car.leasing}€/${lang === 'ru' ? 'мес' : lang === 'lv' ? 'mēnesī' : 'per month'}</span>
            </div>
          </div>` : `<div class="catalog__card-price">
            <h6>${car.price}€</h6>
            <div>
              ${lang === 'ru' ? 'Лизинг от' : lang === 'lv' ? 'Līzings no' : 'Leasing from'}
              <span>${car.leasing}€/${lang === 'ru' ? 'мес' : lang === 'lv' ? 'mēnesī' : 'per month'}</span>
            </div>
          </div>`}
        </a>
      </div>
    `
}

function renderRelatedCars(currentCarId, lang) {
  const container = document.querySelector('.catalog__cards')
  const catalogSection = document.querySelector('.catalog--product')

  if (!container || !catalogSection) return

  container.innerHTML = ''

  // Берем массив машин для текущего языка
  const carsByLang = cars[lang]

  // Фильтруем текущую машину
  const otherCars = carsByLang.filter(c => String(c.id) !== String(currentCarId) && c.isSold !== true)

  // Перемешиваем массив случайным образом
  const shuffled = otherCars.sort(() => 0.5 - Math.random())

  // Берем первые 8
  const related = shuffled.slice(0, 8)

  // Скрываем секцию если нет машин
  if (related.length === 0) {
    catalogSection.style.display = 'none'
    return
  } else {
    catalogSection.style.display = ''
  }

  related.forEach(car => {
    container.insertAdjacentHTML('beforeend', createCatalogCard(car))
  })
}

// ============================== Переключение языка ==============================
document.querySelectorAll('.lang__list-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault()
    const newLang = link.dataset.lang
    let page = 'index.html'

    if (newLang === 'ru') page = 'ru.html'
    if (newLang === 'eng') page = 'eng.html'

    window.location.href = `/product/${page}?&id=${carId}`
  })
})

// ============================== Информация о цене (при наведении) ==============================
const productInfo = document.querySelector('.product__price-left-info')
const productInfoText = document.querySelector('.product__price-left-info-text')

productInfo.addEventListener('mouseenter', () => {
  productInfoText.classList.add('active')
})

productInfo.addEventListener('mouseleave', () => {
  productInfoText.classList.remove('active')
})

// ============================== Главный слайдер ==============================
$('.product__slider').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  infinite: false,
  asNavFor: '.product__pagination',
})

// ============================== Миниатюры (пагинация) ==============================
$('.product__pagination').slick({
  slidesToShow: 5,
  slidesToScroll: 1,
  focusOnSelect: true,
  asNavFor: '.product__slider',
  infinite: false,
  arrows: true,
  centerMode: false,
  prevArrow: '<button type="button" class="product-arrow prev">‹</button>',
  nextArrow: '<button type="button" class="product-arrow next">›</button>',
})

// ============================== Галерея картинок (Fancybox) ==============================
Fancybox.bind("[data-fancybox='gallery']", {
  placeFocusBack: false
})

// ============================== Калькулятор (переменные) ==============================
const outputAmount = document.querySelector("[data-calc-amount]")

const rangeTerm = document.getElementById('range-term')
const progressTerm = document.querySelector('.catalog__range-progress--term')
const outputTerm = document.querySelector("[data-calc-term]")

const outputFinish = document.querySelector('[data-calc-finish]')

outputAmount.textContent = car.price

const minTerm = 12
const maxTerm = 84

// ============================== Калькулятор (логика) ==============================
function updateMonthlyPayment() {
  const C = parseFloat(outputAmount.textContent) // цена
  const n = parseInt(rangeTerm.value)            // срок в месяцах
  const r = 0.07                                 // 8% годовых
  const monthlyRate = r / 12

  const payment = (C * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n))
  outputFinish.textContent = payment.toFixed(2)
}

function updateProgressTerm() {
  const val = parseInt(rangeTerm.value)

  const percent = ((val - minTerm) / (maxTerm - minTerm)) * 100
  progressTerm.style.width = percent + "%"

  outputTerm.textContent = val

  updateMonthlyPayment()
}

rangeTerm.addEventListener('input', updateProgressTerm)

updateProgressTerm()

// ============================== Выводим артикул и цену в поле формы ==============================
// Артикул
const articleFormInput = document.querySelector('input[name="carId"]')
articleFormInput.value = `${lang === 'ru' ? 'Арт. ' : 'Art. '}` + car.article
articleFormInput.classList.add('disabled')
articleFormInput.readOnly = true

// Цена
const priceFormInput = document.querySelector('input[name="amount"]')
priceFormInput.value = car.price + ' €'
priceFormInput.classList.add('disabled')
priceFormInput.readOnly = true
