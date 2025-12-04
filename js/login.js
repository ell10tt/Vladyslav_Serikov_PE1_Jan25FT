document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const messageContainer = document.getElementById('message__container');
    const apiUrl = 'https://v2.api.noroff.dev/auth/login';

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const { email, password } = loginForm.elements;
        const loginData = {
            email: email.value,
            password: password.value,
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });
            const result = await response.json();

            if (response.ok) {
                const { name, accessToken } = result.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('userName', name);
                
                messageContainer.style.color = 'green';
                messageContainer.textContent = 'Login successful! Redirecting...';
                
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1000);
            } else {
                messageContainer.style.color = 'red';
                const errorMsg = result.errors?.[0]?.message || 'Login failed';
                messageContainer.textContent = `Error: ${errorMsg}`;
            }
        } catch (error) {
            messageContainer.style.color = 'red';
            messageContainer.textContent = 'An unexpected error occurred.';
        }
    });
});