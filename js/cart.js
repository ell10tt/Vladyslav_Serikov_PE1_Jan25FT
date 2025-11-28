document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart__container');
    const cartSummaryContainer = document.getElementById('cart__summary');
    const totalPriceElement = document.getElementById('total__price');

    function displayCart() {
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        cartContainer.innerHTML = '';

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Your cart is empty. <a href="/index.html">Continue shopping</a>.</p>';
            if (cartSummaryContainer) cartSummaryContainer.style.display = 'none';
            return;
        }

        if (cartSummaryContainer) cartSummaryContainer.style.display = 'block';

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.dataset.id = item.id;

            let imgSrc = 'https://via.placeholder.com/80';
            let imgAlt = item.title;
            if (item.image && item.image.url) {
                imgSrc = item.image.url;
                imgAlt = item.image.alt || item.title;
            } else if (item.imageUrl) {
                imgSrc = item.imageUrl;
            }

            itemElement.innerHTML = `
                <a href="product.html?id=${item.id}" class="cart-item__link">
                    <img src="${imgSrc}" alt="${imgAlt}" class="cart-item__image">
                </a>
                
                <a href="product.html?id=${item.id}" class="cart-item__title-link">
                    <h3>${item.title}</h3>
                </a>

                <p class="cart-item__price">$${item.price}</p>
                
                <div class="quantity-selector">
                    <button class="qty-btn decrease">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn increase">+</button>
                </div>
                
                <button class="remove-item-btn">Remove</button>
            `;
            cartContainer.appendChild(itemElement);
        });

        updateTotal();
    }

    function updateTotal() {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        let total = 0;

        cart.forEach(item => {
            let price = parseFloat(item.price);
            
            if (isNaN(price)) price = 0;

            total += price * item.quantity;
        });

        if (totalPriceElement) {
            totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
        }
    }

    function changeQuantity(productId, action) {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const item = cart.find(p => p.id === productId);

        if (item) {
            if (action === 'increase') {
                item.quantity += 1;
            } else if (action === 'decrease') {
                item.quantity -= 1;
            }

            if (item.quantity < 1) {
                cart = cart.filter(p => p.id !== productId);
            }
        }
        
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        displayCart();
    }

    function removeItem(productId) {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const updatedCart = cart.filter(p => p.id !== productId);
        localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));
        displayCart();
    }

    if (cartContainer) {
        cartContainer.addEventListener('click', (event) => {
            const target = event.target;
            const item = target.closest('.cart-item');
            if (!item) return;
            const id = item.dataset.id;

            if (target.classList.contains('remove-item-btn')) {
                removeItem(id);
            } else if (target.classList.contains('increase')) {
                changeQuantity(id, 'increase');
            } else if (target.classList.contains('decrease')) {
                changeQuantity(id, 'decrease');
            }
        });
    }

    const clearBtn = document.getElementById('clear__cart__btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your cart?')) {
                localStorage.removeItem('shoppingCart');
                displayCart();
            }
        });
    }

    displayCart();
});