document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart__container');
    const cartSummaryContainer = document.getElementById('cart__summary');
    const totalPriceElement = document.getElementById('total__price');
    const promoCodeInput = document.getElementById('promo__code__input');
    
    let promoCodeApplied = false;

    function displayCart() {
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        cartContainer.innerHTML = '';

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Your cart is empty. <a href="/index.html">Continue shopping</a>.</p>';
            if(cartSummaryContainer) cartSummaryContainer.style.display = 'none';
            return;
        }

        if(cartSummaryContainer) cartSummaryContainer.style.display = 'block';

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
                <img src="${imgSrc}" alt="${imgAlt}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
                <h3>${item.title}</h3>
                <p>Price: $${item.price}</p>
                <div>
                    Quantity: 
                    <input type="number" class="item-quantity" value="${item.quantity}" min="1" style="width: 50px; padding: 5px;">
                </div>
                <button class="remove-item-btn" style="padding: 5px 10px; background: #ff6b6b; color: white; border: none; cursor: pointer; border-radius: 4px;">Remove</button>
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
            let discountedPrice = parseFloat(item.discountedPrice);
            
            if (isNaN(price)) price = 0;
            if (isNaN(discountedPrice)) discountedPrice = price;

            const priceToUse = (promoCodeApplied && discountedPrice < price) ? discountedPrice : price;
            total += priceToUse * item.quantity;
        });

        if (totalPriceElement) {
            totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
        }
    }

    function updateItemQuantity(productId, quantity) {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const item = cart.find(p => p.id === productId);
        if (item) {
            let newQty = parseInt(quantity, 10);
            if (isNaN(newQty) || newQty < 1) newQty = 1;
            item.quantity = newQty;
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
            if (event.target.classList.contains('remove-item-btn')) {
                const productId = event.target.closest('.cart-item').dataset.id;
                removeItem(productId);
            }
        });

        cartContainer.addEventListener('change', (event) => {
            if (event.target.classList.contains('item-quantity')) {
                const productId = event.target.closest('.cart-item').dataset.id;
                updateItemQuantity(productId, event.target.value);
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
    
    const applyPromoBtn = document.getElementById('apply__promo__btn');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', () => {
            if (promoCodeInput && promoCodeInput.value.trim().toUpperCase() === 'N0R0FF') {
                promoCodeApplied = true;
                alert('Promo code applied successfully!');
                updateTotal();
                promoCodeInput.disabled = true;
            } else {
                alert('Invalid promo code.');
            }
        });
    }

    displayCart();
});