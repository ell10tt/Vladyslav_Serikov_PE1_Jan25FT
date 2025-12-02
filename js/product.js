document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product__detail__container');
    const apiUrlBase = 'https://v2.api.noroff.dev/online-shop/';
    let currentProduct = null;

    function isLoggedIn() {
        return !!localStorage.getItem('accessToken');
    }

    function getProductIdFromUrl() {
        return new URLSearchParams(window.location.search).get('id');
    }

    async function fetchProduct() {
        try {
            const id = getProductIdFromUrl();
            if (!id) throw new Error('No ID');
            const response = await fetch(apiUrlBase + id);
            const json = await response.json();
            currentProduct = json.data;
            renderProduct(currentProduct);
        } catch (error) {
            console.error(error);
        }
    }

    function renderProduct(product) {
        document.title = product.title;

        const tagsHtml = product.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ');
        
        let reviewsHtml = '<p>No reviews yet.</p>';
        if (product.reviews && product.reviews.length > 0) {
            reviewsHtml = '<h3>Reviews</h3>' + product.reviews.map(review => `
                <div class="review">
                    <strong>${review.username}</strong> (Rating: ${review.rating}/5)
                    <p>${review.description}</p>
                </div>
            `).join('');
        }

        const addToCartButtonHtml = isLoggedIn()
            ? `<button id="add__to__cart__btn">BUY</button>`
            : `<p class="login-prompt">Please <a href="/account/login.html">log in</a> to purchase.</p>`;

        productContainer.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image.url}" alt="${product.image.alt}">
            </div>

            <div class="product-info-container">
                <h1>${product.title}</h1>

                <div class="product-details-grid">
                    <strong>Price:</strong>
                    <span>$${product.price}</span>
                    
                    ${product.discountedPrice < product.price ? `<strong>Discount:</strong> <span>$${product.discountedPrice}</span>` : ''}

                    <strong>Rating:</strong>
                    <span>${product.rating} / 5</span>

                    <strong>Tags:</strong>
                    <div>${tagsHtml}</div>
                </div>

                <div class="product-buttons">
                    ${addToCartButtonHtml}
                    <button id="share__btn" class="share__btn">Share Link</button>
                </div>
                
                <div class="product-description">
                    <strong>Description:</strong>
                    <br>
                    ${product.description}
                </div>
            </div>

            <div class="product-reviews-section">
                <hr>
                ${reviewsHtml}
            </div>
        `;
    }
    
    function addToCart() {
        if (!currentProduct) return;
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const existingProduct = cart.find(item => item.id === currentProduct.id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...currentProduct, quantity: 1 });
        }

        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        alert(`${currentProduct.title} added to cart!`);
    }
    
    function shareProduct() {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }

    productContainer.addEventListener('click', (event) => {
        if (event.target.id === 'add__to__cart__btn') addToCart();
        if (event.target.id === 'share__btn') shareProduct();
    });

    fetchProduct();
});