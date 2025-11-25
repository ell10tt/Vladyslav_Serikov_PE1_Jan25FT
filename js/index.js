document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://api.noroff.dev/api/v1/online-shop';

    const carouselSlidesContainer = document.getElementById('carousel__slides');
    const prevBtn = document.getElementById('prev__btn');
    const nextBtn = document.getElementById('next__btn');
    const productGridContainer = document.getElementById('product__grid');
    const loadMoreBtn = document.getElementById('load__more__btn');
    const tagsContainer = document.getElementById('tags__filter__container');
    
    let allProducts = [];
    let currentFilteredProducts = [];
    let productsCurrentlyShown = 0;
    const productsPerPage = 12;

    async function initializePage() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`API request failed: ${response.status}`);
            allProducts = await response.json();
            currentFilteredProducts = [...allProducts];

            initCarousel(allProducts.slice(0, 3));
            createTagFilters();
            renderMoreProducts();

        } catch (error) {
            console.error("Error initializing the page:", error);
            document.querySelector('main').innerHTML = '<p>Could not load product data.</p>';
        }
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
                <img src="${product.imageUrl}" alt="${product.title}" style="max-width: 100%; height: 200px; object-fit: cover;">
                <h3>${product.title}</h3>
                <p>Price: $${product.price}</p>
                <div>
                    <a href="product.html?id=${product.id}">More details</a>
                    <button class="buy-button" data-id="${product.id}">Buy</button>
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

    function initCarousel(products) {
        let currentIndex = 0;
        const totalSlides = products.length;

        function renderCarousel() {
            if (!carouselSlidesContainer) return;
            carouselSlidesContainer.innerHTML = '';
            const p = products[currentIndex];

            carouselSlidesContainer.innerHTML = `
                <div class="carousel-slide-item">
                    <img class="carousel-slide__image" src="${p.imageUrl}" alt="${p.title}">
                    <h3 class="carousel-slide__title">${p.title}</h3>
                    <a class="carousel-slide__link" href="product.html?id=${p.id}">View Product</a>
                </div>
            `;
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                renderCarousel();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalSlides;
                renderCarousel();
            });
        }
        renderCarousel();
    }

    function addToCart(productId) {
        const productToAdd = allProducts.find(p => p.id === productId);
        if (!productToAdd) return;

        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }

        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        alert(`${productToAdd.title} added to your cart!`);
    }

    loadMoreBtn.addEventListener('click', renderMoreProducts);
    productGridContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('buy-button')) {
            addToCart(event.target.dataset.id);
        }
    });

    initializePage();
});