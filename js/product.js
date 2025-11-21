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
            ? '<button id="add__to__cart__btn">Add to Cart</button>'
            : '<p>Please <a href="/account/login.html">log in</a> to purchase this item.</p>';

        productContainer.innerHTML = `
            <div>
                <img src="${product.image.url}" alt="${product.image.alt}">
            </div>
            <div>
                <h1>${product.title}</h1>
                <p>${product.description}</p>
                <p><strong>Price:</strong> <span>$${product.price}</span></p>
                ${product.discountedPrice < product.price ? `<p><strong>Discount Price:</strong> $${product.discountedPrice}</p>` : ''}
                <p><strong>Rating:</strong> ${product.rating} / 5</p>
                <div><strong>Tags:</strong> ${tagsHtml}</div>
                <hr>
                <div>${reviewsHtml}</div>
                <hr>
                ${addToCartButtonHtml}
                <button id="share__btn">Share</button>
            </div>
        `;
    }

    productContainer.addEventListener('click', (event) => {
        if (event.target.id === 'add__to__cart__btn') addToCart();
        if (event.target.id === 'share__btn') shareProduct();
    });

    fetchProduct();
});