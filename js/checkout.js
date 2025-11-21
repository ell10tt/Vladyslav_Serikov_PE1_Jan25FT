document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout__form');

    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();

        localStorage.removeItem('shoppingCart');

        window.location.href = '/success.html';
    });
});