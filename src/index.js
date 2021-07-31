import imageCardTpl from './templates/image-card.hbs';
import './css/styles.css'
import NewApiService from './js/apiService';

// Плагин открытия модального окна (вовремя нажатия на картинку)
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

// Для ошибки
import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';

const refs = {
    searchForm: document.querySelector('.search-form'),
    galleryContainer: document.querySelector('.gallery'),
    sentinel: document.querySelector('#sentinel'),
    dots: document.querySelector('.dots')
}

const newApiService = new NewApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.galleryContainer.addEventListener('click', onGallaryImageClick)

function onSearch(e) {
    clearContainer()
    e.preventDefault();
    
    newApiService.query = e.currentTarget.elements.query.value.trim();
    
    // Если ошибка
    if (newApiService.query.length === 0) {
        return onFetchError();
    }

    newApiService.resetPage();
    onLoadMore();
    newApiService.incrementPage()
    refs.dots.classList.remove('load-more');
};

function onLoadMore() {
    newApiService.fetchImages().then(data => {
        if (data.length === 0) {
            return onFetchError();
        }
        addImageMarkup(data);
    })
}

function addImageMarkup(hits) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', imageCardTpl(hits));
    refs.galleryContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
    });
}

function clearContainer() {
    refs.galleryContainer.innerHTML = '';
}

function onGallaryImageClick(e) {
    const largeImageInModal = basicLightbox.create(
        `<img src="${e.target.dataset.source}" alt="${e.target.alt}" >`
    );
    console.log(e.target.dataset.source)
    if (e.target.nodeName === 'IMG') {
        largeImageInModal.show();
    }
}

function onFetchError() {
    error({
        text: 'Sorry, no images could be found for this request!',
        sticker: false,
        hide: true,
        delay: 2000,
    })
}

// Intersection observer (infinity scroll)
const onEntry = entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && newApiService.query !== '') {
            newApiService.fetchImages().then(data => {
                addImageMarkup(data);
                newApiService.incrementPage()
            })
        }
    })
}

const observer = new IntersectionObserver(onEntry);
observer.observe(refs.sentinel);