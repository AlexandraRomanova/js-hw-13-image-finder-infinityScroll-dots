const API_KEY = '22611296-ff7f5144bc809470e7149d95a';
const BASE_URL = 'https://pixabay.com/api';

export default class ImageApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    fetchImages() {
        const searchParams = new URLSearchParams({
            image_type: 'photo',
            orientation: 'horizontal',
            q: this.searchQuery,
            page: this.page,
            per_page: 12,
            key: API_KEY,
        });

        const url = `${BASE_URL}/?${searchParams}`;
        return fetch(url)
            .then(response => {
                return response.json()
            })
            .then(({ hits }) => {
                return hits;
            })
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
};