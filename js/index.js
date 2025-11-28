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
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const json = await response.json();
            
            allProducts = json.data; 
            currentFilteredProducts = [...allProducts];

            initCarousel(allProducts.slice(0, 3));
            createTagFilters();
            renderMoreProducts();

        } catch (error) {
            console.error("Error:", error);
        }
    }

    function initCarousel(products) {
        if (!carouselSlidesContainer || products.length === 0) return;
        
        let currentIndex = 0;
        const totalSlides = products.length;

        function renderCarousel() {
            carouselSlidesContainer.innerHTML = '';
            const p = products[currentIndex];

            let imgSrc = 'https://via.placeholder.com/400';
            let imgAlt = 'Product';
            if (p.image && p.image.url) {
                imgSrc = p.image.url;
                imgAlt = p.image.alt || p.title;
            }

            carouselSlidesContainer.innerHTML = `
                <div class="carousel__slide" style="background-image: url('${imgSrc}');">
                    <div class="carousel__blur"></div>
                    <img class="carousel__image" src="${imgSrc}" alt="${imgAlt}">
                    <h3 class="carousel__title">${p.title}</h3>
                    <a class="carousel__link" href="product.html?id=${p.id}">View Product</a>
                </div>
            `;
        }

        if (prevBtn) {
            const newPrevBtn = prevBtn.cloneNode(true);
            prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
            newPrevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                renderCarousel();
            });
        }

        if (nextBtn) {
            const newNextBtn = nextBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
            newNextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalSlides;
                renderCarousel();
            });
        }
        
        renderCarousel();
    }

    function createTagFilters() {
        if (!tagsContainer) return;
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
        if (productGridContainer) productGridContainer.innerHTML = '';
        productsCurrentlyShown = 0;
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        renderMoreProducts();
    }

    function renderMoreProducts() {
        if (!productGridContainer) return;

        const productsToRender = currentFilteredProducts.slice(productsCurrentlyShown, productsCurrentlyShown + productsPerPage);

        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            let imgSrc = product.image ? product.image.url : 'https://via.placeholder.com/300';
            
            productCard.innerHTML = `
                <img src="${imgSrc}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>Price: $${product.price}</p>
                <div>
                    <a href="product.html?id=${product.id}">More Details</a>
                    <button class="buy-button" data-id="${product.id}">Buy</button>
                </div>
            `;
            productGridContainer.appendChild(productCard);
        });

        productsCurrentlyShown += productsToRender.length;

        if (loadMoreBtn) {
            if (productsCurrentlyShown < currentFilteredProducts.length) {
                loadMoreBtn.style.display = 'block';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
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
        alert(`${productToAdd.title} added to cart!`);
    }

    if (loadMoreBtn) loadMoreBtn.addEventListener('click', renderMoreProducts);
    if (productGridContainer) {
        productGridContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('buy-button')) {
                addToCart(event.target.dataset.id);
            }
        });
    }

    initializePage();
});