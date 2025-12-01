import cars from './cars.js'

// ============================== Раскрытие фильтров ==============================
const openBtn = document.querySelector('.catalog__open-filters')
const filters = document.querySelector('.catalog__left')

if (openBtn) {
  openBtn.addEventListener('click', () => filters.classList.toggle('active'))
}

// ============================== Выбор бренда (только один) ==============================
function updateSelectTopBrand() {
  const selectTop = document.querySelector('.catalog__brand-choise')
  const checkedRadio = document.querySelector(".catalog__select-list input[type='radio']:checked")
  if (checkedRadio) {
    const label = checkedRadio.parentElement.querySelector('span')
    selectTop.textContent = label.textContent
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const radios = document.querySelectorAll(".catalog__select-list input[type='radio']")

  updateSelectTopBrand()

  radios.forEach(radio => radio.addEventListener('change', updateSelectTopBrand))
})


// ============================== Списки фильтров ==============================
const titleList = document.querySelectorAll('.catalog__select-top')

titleList.forEach(item => {
  item.addEventListener('click', (e) => {
    const catalogSelect = e.target.closest('.catalog__select')
    catalogSelect.classList.toggle('active')
  })
})

// ============================== Диапазон года выпуска ==============================
const rangeMinYear = document.getElementById('rangeMin--year')
const rangeMaxYear = document.getElementById('rangeMax--year')
const minInputRangeYear = document.getElementById('minInputRange--year')
const maxInputRangeYear = document.getElementById('maxInputRange--year')
const progressYear = document.querySelector('.catalog__range-progress--year')

let minGap = 1
const minYear = 2006
const maxYear = 2023

// function updateProgressYear() {
//   let minVal = parseInt(rangeMinYear.value)
//   let maxVal = parseInt(rangeMaxYear.value)

//   progressYear.style.left = ((minVal - minYear) / (maxYear - minYear)) * 100 + "%"
//   progressYear.style.right = 100 - ((maxVal - minYear) / (maxYear - minYear)) * 100 + "%"

//   minInputRangeYear.value = minVal
//   maxInputRangeYear.value = maxVal
// }

// rangeMinYear.addEventListener('input', () => {
//   if (parseInt(rangeMaxYear.value) - parseInt(rangeMinYear.value) <= minGap) {
//     rangeMinYear.value = parseInt(rangeMaxYear.value) - minGap
//   }
// })

// rangeMaxYear.addEventListener('input', () => {
//   if (parseInt(rangeMaxYear.value) - parseInt(rangeMinYear.value) <= minGap) {
//     rangeMaxYear.value = parseInt(rangeMinYear.value) + minGap
//   }
// })

// minInputRangeYear.addEventListener('change', () => {
//   let val = parseInt(minInputRangeYear.value)
//   rangeMinYear.value = Math.max(minYear, Math.min(val, parseInt(rangeMaxYear.value) - minGap))
// })

// maxInputRangeYear.addEventListener('change', () => {
//   let val = parseInt(maxInputRangeYear.value)
//   rangeMaxYear.value = Math.min(maxYear, Math.max(val, parseInt(rangeMinYear.value) + minGap))
// })

// updateProgressYear()

// ============================== Диапазон цены ==============================
const rangeMinPrice = document.getElementById('rangeMin--price')
const rangeMaxPrice = document.getElementById('rangeMax--price')
const minInputRangePrice = document.getElementById('minInputRange--price')
const maxInputRangePrice = document.getElementById('maxInputRange--price')
const progressPrice = document.querySelector('.catalog__range-progress--price')

const minPrice = 3590
const maxPrice = 64990

// function updateProgressPrice() {
//   let minVal = parseInt(rangeMinPrice.value)
//   let maxVal = parseInt(rangeMaxPrice.value)

//   progressPrice.style.left = ((minVal - minPrice) / (maxPrice - minPrice)) * 100 + "%"
//   progressPrice.style.right = 100 - ((maxVal - minPrice) / (maxPrice - minPrice)) * 100 + "%"

//   minInputRangePrice.value = minVal
//   maxInputRangePrice.value = maxVal
// }

// rangeMinPrice.addEventListener('input', () => {
//   if (parseInt(rangeMaxPrice.value) - parseInt(rangeMinPrice.value) <= minGap) {
//     rangeMinPrice.value = parseInt(rangeMaxPrice.value) - minGap
//   }
// })

// rangeMaxPrice.addEventListener('input', () => {
//   if (parseInt(rangeMaxPrice.value) - parseInt(rangeMinPrice.value) <= minGap) {
//     rangeMaxPrice.value = parseInt(rangeMinPrice.value) + minGap
//   }
// })

// minInputRangePrice.addEventListener('change', () => {
//   let val = parseInt(minInputRangePrice.value)
//   rangeMinPrice.value = Math.max(minPrice, Math.min(val, parseInt(rangeMaxPrice.value) - minGap))
// })

// maxInputRangePrice.addEventListener('change', () => {
//   let val = parseInt(maxInputRangePrice.value)
//   rangeMaxPrice.value = Math.min(maxPrice, Math.max(val, parseInt(rangeMinPrice.value) + minGap))
// })

// updateProgressPrice()

// ============================== Фильтрация ==============================
const carsPerPage = 12 // количество карточек на странице
let currentIndex = 0 // текущий индекс
let filteredCars = null // сюда сохраняем результат поиска + фильтров
let activeFilter = 'all' // текущий выбранный фильтр (сортировки (4 шт.))

const currentLang = document.documentElement.getAttribute('lang')

const cardsContainer = document.querySelector('.catalog__cards')
const foundCountEl = document.querySelector('[data-quantity]')
const showMore = document.querySelector('.catalog__show')

const searchInput = document.querySelector('.catalog__search input')
const searchBtn = document.querySelector('.catalog__search button')
const filterBtns = document.querySelectorAll('.catalog__filter-cards li')
const clearBtn = document.querySelector('#clear-filters')

const noResultsText = {
  ru: 'Ничего не найдено',
  lv: 'Nav atrasts',
  eng: 'No results found'
}

// При загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  renderCars(currentLang)
  toggleClearBtnVisibility()
  document.querySelector('[data-filter="all"]').classList.add('active')
})

// Функция рендера карточек
function renderCars(lang) {
  const carsList = filteredCars || cars[lang].filter(car => !car.isSold) || []

  // Обновляем цифру "Найдено X авто" каждый раз при рендере
  if (foundCountEl) {
    foundCountEl.textContent = carsList.length
  }

  const slice = carsList.slice(currentIndex, currentIndex + carsPerPage)

  slice.forEach(car => {
    cardsContainer.insertAdjacentHTML('beforeend', `
      <div class="catalog__card-wrapper">
        <a href="/product/${currentLang === 'ru' ? 'ru.html' : currentLang === 'lv' ? 'index.html' : 'eng.html'}?id=${car.id}" class="catalog__card">
          <div class="catalog__card-img-wrapper">
            <img class="catalog__card-img" src="${car.mainImg}" alt="car-img">

            <div class="catalog__card-img-info">
              ${car.isSold ? `<span class="catalog__card-img-info-sold">SOLD</span>` : ''}
              ${car.isNew ? `<span class="catalog__card-img-info-new">NEW!</span>` : ''}
              ${car.discount > 0 ? `<span class="catalog__card-img-info-discount">
                -${car.discount}€
              </span>` : ''}
              ${car.availability ? `<span class="catalog__card-img-info-availability">
                ${car.availability}
              </span>` : ''}
            </div>

            <span class="catalog__card-img-article">${car.article}</span>
          </div>

          <div class="catalog__card-info-wrapper">

          <div class="catalog__card-title">
            <h5>${car.title}</h5>
          </div>

          <div class="catalog__card-info">
            <span><img src="img/calendar-2.svg" alt="calendar-2">${car.year}</span>
            <span><img src="img/transmission-2.svg" alt="transmission-2">${car.transmission}</span>
            <span><img src="img/speedometer-2.svg" alt="speedometer-2">${car.mileage.toLocaleString('ru-RU')}</span>
            <span><img src="img/engine.svg" alt="engine">${car.engine}</span>
          </div>

          ${car.isSold ? `<div class="catalog__card-price">
            <h6>${currentLang === 'ru' ? 'Продано' : currentLang === 'lv' ? 'Pārdots' : 'Sold'}</h6>
            <div class="hidden">
              ${currentLang === 'ru' ? 'Лизинг от' : currentLang === 'lv' ? 'Līzings no' : 'Leasing from'}
              <span>${car.leasing}€/${currentLang === 'ru' ? 'мес' : currentLang === 'lv' ? 'mēnesī' : 'per month'}</span>
            </div>
          </div>` : `<div class="catalog__card-price">
            <h6>${car.price}<span> EUR</span></h6>
            <div>
              ${currentLang === 'ru' ? 'Лизинг от' : currentLang === 'lv' ? 'Līzings no' : 'Leasing from'}
              <span>${car.leasing}€/${currentLang === 'ru' ? 'мес' : currentLang === 'lv' ? 'mēnesī' : 'per month'}</span>
            </div>
          </div>`}

          </div>
        </a>
      </div>
    `)
  })

  currentIndex += slice.length

  if (slice.length === 0 && currentIndex === 0) {
    cardsContainer.innerHTML = `<p class="catalog__empty">${noResultsText[lang]}</p>`
    showMore.classList.remove('active')
    return
  }

  if (currentIndex >= carsList.length) {
    showMore.classList.remove('active')
  } else {
    showMore.classList.add('active')
  }
}

// Функция применения фильтров
function applyFilters() {
  const query = searchInput.value.trim().toLowerCase()
  const allCars = cars[currentLang] || []

  let result = allCars

  // Поиск
  if (query) {
    result = result.filter(car => {
      return (
        car.title.toLowerCase().includes(query) ||
        car.article.toLowerCase().includes(query) ||
        String(car.year).includes(query)
      )
    })
  }

  // Бренд
  const brandInput = document.querySelector('.catalog__brand input[name="brand"]:checked')
  if (brandInput && brandInput.value !== 'all') {
    result = result.filter(car => car.brand.toLowerCase() === brandInput.value.toLowerCase())
  }

  // Год
  const minYear = Number(document.getElementById('minInputRange--year').value)
  const maxYear = Number(document.getElementById('maxInputRange--year').value)
  result = result.filter(car => car.year >= minYear && car.year <= maxYear)

  // Цена
  const minPrice = Number(document.getElementById('minInputRange--price').value)
  const maxPrice = Number(document.getElementById('maxInputRange--price').value)
  result = result.filter(car => car.price >= minPrice && car.price <= maxPrice)

  // Пробег
  const mileageChecks = document.querySelectorAll('.catalog__select input[name="mileage"]:checked')
  if (mileageChecks.length > 0) {
    const mileageValues = Array.from(mileageChecks).map(c => c.value)
    result = result.filter(car => {
      return mileageValues.some(val => {
        if (val === 'more250k') return car.mileage > 250000
        return car.mileage <= Number(val)
      })
    })
  }

  // Топливо
  const fuelChecks = document.querySelectorAll('.catalog__select input[name="fuel"]:checked')
  if (fuelChecks.length > 0) {
    const fuelValues = Array.from(fuelChecks).map(c => c.value.toLowerCase())
    result = result.filter(car => fuelValues.includes(car.fuel.toLowerCase()))
  }

  // Коробка передач
  const transChecks = document.querySelectorAll('.catalog__select input[name="transmission"]:checked')
  if (transChecks.length > 0) {
    const transValues = Array.from(transChecks).map(c => c.value.toLowerCase())
    result = result.filter(car => transValues.includes(car.transmission.toLowerCase()))
  }

  // Доступность
  const availChecks = document.querySelectorAll('.catalog__select input[name="availability"]:checked')
  if (availChecks.length > 0) {
    const availValues = Array.from(availChecks).map(c => c.value.toLowerCase())
    result = result.filter(car => availValues.includes(car.availability.toLowerCase()))
  }

  // Сортировка (4 шт.)
  if (activeFilter) {
    switch (activeFilter) {
      case 'new':
        result = result.filter(car => car.isNew === true)
        break
      case 'discount':
        result = result.filter(car => car.discount > 0)
        break
      case 'sold':
        result = result.filter(car => car.isSold === true)
        break
      default:
        result = result.filter(car => !car.isSold)
        break
    }
  }

  filteredCars = result
  currentIndex = 0
  cardsContainer.innerHTML = ''
  renderCars(currentLang)

  toggleClearBtnVisibility()
}

// Функция очистки фильтров
function clearFilters() {
  // Сброс поиска
  searchInput.value = ''

  // Сброс бренда
  const brandRadios = document.querySelectorAll('.catalog__brand input[name="brand"]')
  brandRadios.forEach(r => r.checked = r.value === 'all')
  updateSelectTopBrand()

  // Сброс года
  document.getElementById('minInputRange--year').value = minYear
  document.getElementById('maxInputRange--year').value = maxYear
  document.getElementById('rangeMin--year').value = minYear
  document.getElementById('rangeMax--year').value = maxYear
  updateProgressYear()

  // Сброс цены
  document.getElementById('minInputRange--price').value = minPrice
  document.getElementById('maxInputRange--price').value = maxPrice
  document.getElementById('rangeMin--price').value = minPrice
  document.getElementById('rangeMax--price').value = maxPrice
  updateProgressPrice()

  // Сброс всех чекбоксов
  const allCheckboxes = document.querySelectorAll('.catalog__select input[type="checkbox"]')
  allCheckboxes.forEach(cb => cb.checked = false)

  // Сброс сортировки
  filterBtns.forEach(b => b.classList.remove('active'))
  activeFilter = 'all'
  document.querySelector('[data-filter="all"]').classList.add('active')

  // Обновляем список
  filteredCars = null
  currentIndex = 0
  cardsContainer.innerHTML = ''
  renderCars(currentLang)

  toggleClearBtnVisibility()
}

// При клике на "Показать еще" рендерим следующие карточки
showMore.addEventListener('click', () => renderCars(currentLang))

// Применяем фильтры
clearBtn.addEventListener('click', clearFilters)
searchBtn.addEventListener('click', applyFilters)
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault()
    applyFilters()
  }
})

// Сортировка (4 шт.)
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'))

    btn.classList.add('active')
    activeFilter = btn.dataset.filter

    applyFilters()
  })
})

// Фильтры слева
document.querySelectorAll(
  '.catalog__brand input, .catalog__select input').forEach(el => {
    el.addEventListener('input', applyFilters)
  })

// Ползнуки года и цены (инпут - change, ползунок - input)
document.querySelectorAll('#minInputRange--year, #maxInputRange--year, #minInputRange--price, #maxInputRange--price').forEach(el => {
  el.addEventListener('change', () => {
    updateProgressYear()
    updateProgressPrice()
    applyFilters()
  })
})

document.querySelectorAll('#rangeMin--year, #rangeMax--year, #rangeMin--price, #rangeMax--price').forEach(el => {
  el.addEventListener('input', () => {
    updateProgressYear()
    updateProgressPrice()
    applyFilters()
  })
})

// Функция определения видимости кнопки "Сбросить фильтры"
function toggleClearBtnVisibility() {
  const query = searchInput.value.trim().toLowerCase()

  const brandInput = document.querySelector('.catalog__brand input[name="brand"]:checked')
  const minYearVal = Number(document.getElementById('minInputRange--year').value)
  const maxYearVal = Number(document.getElementById('maxInputRange--year').value)
  const minPriceVal = Number(document.getElementById('minInputRange--price').value)
  const maxPriceVal = Number(document.getElementById('maxInputRange--price').value)

  const mileageChecks = document.querySelectorAll('.catalog__select input[name="mileage"]:checked')
  const fuelChecks = document.querySelectorAll('.catalog__select input[name="fuel"]:checked')
  const transChecks = document.querySelectorAll('.catalog__select input[name="transmission"]:checked')
  const availChecks = document.querySelectorAll('.catalog__select input[name="availability"]:checked')

  // Условие: есть ли активные фильтры ?
  const hasFilters =
    query ||
    (brandInput && brandInput.value !== 'all') ||
    minYearVal !== minYear ||
    maxYearVal !== maxYear ||
    minPriceVal !== minPrice ||
    maxPriceVal !== maxPrice ||
    mileageChecks.length > 0 ||
    fuelChecks.length > 0 ||
    transChecks.length > 0 ||
    availChecks.length > 0 ||
    activeFilter !== 'all'

  if (hasFilters) {
    clearBtn.style.display = 'block'
  } else {
    clearBtn.style.display = 'none'
  }
}
