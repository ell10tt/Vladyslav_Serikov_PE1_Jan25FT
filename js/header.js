document.addEventListener('DOMContentLoaded', () => {
    const burgerBtn = document.getElementById('burger__btn');
    const closeMenuBtn = document.getElementById('close__menu__btn');
    const mobileMenu = document.getElementById('mobile__menu');
    const menuOverlay = document.getElementById('menu__overlay');
    const userActions = document.getElementById('user__actions');

    function toggleMenu() {
        if (!mobileMenu || !menuOverlay) return;
        
        mobileMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');

        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    if (burgerBtn) burgerBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

    function checkUser() {
        if (!userActions) return;

        const userName = localStorage.getItem('userName');
        const token = localStorage.getItem('accessToken');

        if (userName && token) {
            userActions.innerHTML = `
                <span class="user__name">${userName}</span>
                <button id="logout__btn" class="user__logout">Logout</button>
            `;
            
            const logoutBtn = document.getElementById('logout__btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('userName');
                    localStorage.removeItem('accessToken');
                    window.location.reload();
                });
            }
        }
    }

    checkUser();
});