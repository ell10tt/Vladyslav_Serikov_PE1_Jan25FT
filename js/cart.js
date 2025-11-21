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
            cartContainer.innerHTML = '<p>Your cart is empty. <a href="/index.html">Continue shopping</a>.</p>';
            return;
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.dataset.id = item.id;
            
            itemElement.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.title}" style="width: 80px;">
                <h3>${item.title}</h3>
                <p>Price: $${item.price}</p>
                <div>
                    Quantity: 
                    <input type="number" class="item-quantity" value="${item.quantity}" min="1" style="width: 50px;">
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
            const priceToUse = (promoCodeApplied && item.discountedPrice < item.price) ? item.discountedPrice : item.price;
            total += priceToUse * item.quantity;
        });

        totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
    }

    function updateItemQuantity(productId, quantity) {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const item = cart.find(p => p.id === productId);
        if (item) {
            item.quantity = parseInt(quantity, 10);
            if (item.quantity < 1) {
                item.quantity = 1;
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

    document.getElementById('clear__cart__btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            localStorage.removeItem('shoppingCart');
            displayCart();
        }
    });
    
    document.getElementById('apply__promo__btn').addEventListener('click', () => {
        if (promoCodeInput.value.trim().toUpperCase() === 'N0R0FF') {
            promoCodeApplied = true;
            alert('Promo code applied successfully!');
            updateTotal();
            promoCodeInput.disabled = true;
        } else {
            alert('Invalid promo code.');
        }
    });

    displayCart();
});