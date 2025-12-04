document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout__form');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');

    function calculateTotal() {
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        let total = 0;

        cart.forEach(item => {
            let price = parseFloat(item.price);
            if (isNaN(price)) price = 0;
            total += price * item.quantity;
        });

        subtotalEl.textContent = `$${total.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }

    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();
        localStorage.removeItem('shoppingCart');
        window.location.href = '/success.html';
    });

    calculateTotal();
});