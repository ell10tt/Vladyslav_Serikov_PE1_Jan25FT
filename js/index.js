document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://v2.api.noroff.dev/online-shop';

    const carouselSlidesContainer = document.querySelector('.carousel__slides');
    const prevBtn = document.querySelector('.carousel__btn--prev');
    const nextBtn = document.querySelector('.carousel__btn--next');
    const productGridContainer = document.querySelector('.products__grid');
    const loadMoreBtn = document.querySelector('.products__load-more');
    const tagsContainer = document.querySelector('.products__filter');
    
    let allProducts = [];
    let currentFilteredProducts = [];
    let productsCurrentlyShown = 0;
    const productsPerPage = 12;

    async function initializePage() {
        try {
            const response = await fetch(apiUrl);
            const json = await response.json();
            
            allProducts = json.data; 
            currentFilteredProducts = [...allProducts];

            initCarousel(allProducts.slice(0, 3));
            createTagFilters();
            renderMoreProducts();

        } catch (error) {
            console.error(error);
        }
    }

    function initCarousel(products) {
        let currentIndex = 0;
        const totalSlides = products.length;

        function renderCarousel() {
            carouselSlidesContainer.innerHTML = '';
            const p = products[currentIndex];

            carouselSlidesContainer.innerHTML = `
                <div class="carousel__slide" style="background-image: url('${p.image.url}');">
                    <div class="carousel__blur"></div>
                    <img class="carousel__image" src="${p.image.url}" alt="${p.image.alt || p.title}">
                    <h3 class="carousel__title">${p.title}</h3>
                    <a class="carousel__link" href="product.html?id=${p.id}">View Product</a>
                </div>
            `;
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            renderCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            renderCarousel();
        });
        
        renderCarousel();
    }

    function createTagFilters() {
        const allTags = allProducts.flatMap(product => product.tags);
        const uniqueTags = [...new Set(allTags)];
        tagsContainer.innerHTML = '';

        const allButton = document.createElement('button');
        allButton.textContent = 'All';
        allButton.addEventListener('click', () => applyFilter('All'));
        tagsContainer.appendChild(allButton);

        uniqueTags.forEach(tag => {
            const tagButton = document.createElement('button');
            tagButton.textContent = tag;
            tagButton.addEventListener('click', () => applyFilter(tag));
            tagsContainer.appendChild(tagButton);
        });
    }

    function applyFilter(filterTag) {
        if (filterTag === 'All') {
            currentFilteredProducts = [...allProducts];
        } else {
            currentFilteredProducts = allProducts.filter(product => product.tags.includes(filterTag));
        }
        productGridContainer.innerHTML = '';
        productsCurrentlyShown = 0;
        loadMoreBtn.style.display = 'none';
        renderMoreProducts();
    }

    function renderMoreProducts() {
        const productsToRender = currentFilteredProducts.slice(productsCurrentlyShown, productsCurrentlyShown + productsPerPage);

        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            
            productCard.innerHTML = `
                <img src="${product.image.url}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>Price: $${product.price}</p>
                <div>
                    <a href="product.html?id=${product.id}">MORE DETAILS</a>
                    <button class="buy-button" data-id="${product.id}">BUY</button>
                </div>
            `;
            productGridContainer.appendChild(productCard);
        });

        productsCurrentlyShown += productsToRender.length;

        if (productsCurrentlyShown < currentFilteredProducts.length) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    function addToCart(productId) {
        const productToAdd = allProducts.find(p => p.id === productId);
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }

        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        alert(`${productToAdd.title} added to cart!`);
    }

    loadMoreBtn.addEventListener('click', renderMoreProducts);
    
    productGridContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('buy-button')) {
            addToCart(event.target.dataset.id);
        }
    });

    initializePage();
});