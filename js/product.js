document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product__detail__container');
    const apiUrlBase = 'https://v2.api.noroff.dev/online-shop/';
    let currentProduct = null;

    function isLoggedIn() {
        const token = localStorage.getItem('accessToken');
        return !!token;
    }

    function getProductIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    async function fetchProduct() {
        const productId = getProductIdFromUrl();
        if (!productId) {
            productContainer.innerHTML = '<p>Error: Product ID not found.</p>';
            return;
        }

        try {
            const response = await fetch(apiUrlBase + productId);
            if (!response.ok) throw new Error(`Product not found.`);
            const result = await response.json();
            currentProduct = result.data;
            renderProduct(currentProduct);
        } catch (error) {
            console.error("Error fetching product:", error);
            productContainer.innerHTML = '<p>Sorry, we could not find the product.</p>';
        }
    }

    function renderProduct(product) {
        document.title = product.title;

        const tagsHtml = product.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ');
        
        let reviewsHtml = '<h3>Reviews</h3>';
        if (product.reviews && product.reviews.length > 0) {
            reviewsHtml += product.reviews.map(review => `
                <div class="review">
                    <strong>${review.username}</strong> (Rating: ${review.rating}/5)
                    <p>${review.description}</p>
                </div>
            `).join('');
        } else {
            reviewsHtml += '<p>No reviews yet.</p>';
        }

        const addToCartButtonHtml = isLoggedIn()
            ? `<button id="add__to__cart__btn">BUY</button>`
            : `<p>Please <a href="/account/login.html">log in</a> to purchase this item.</p>`;

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

                ${addToCartButtonHtml}
                
                <p class="product-description">
                    <strong>Description:</strong>
                    <br>
                    ${product.description}
                </p>
            </div>

            <div class="product-reviews-section">
                <hr>
                ${reviewsHtml}
            </div>
        `;
    }
    
    function addToCart() {}
    function shareProduct() {}

    productContainer.addEventListener('click', (event) => {
        if (event.target.id === 'add__to__cart__btn') addToCart();
        if (event.target.id === 'share__btn') shareProduct();
    });

    fetchProduct();
});