document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register__form');
    const messageContainer = document.getElementById('message__container');

    const apiUrl = 'https://v2.api.noroff.dev/auth/register';

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        messageContainer.textContent = '';

        const { name, email, password } = registerForm.elements;
        const userData = {
            name: name.value,
            email: email.value,
            password: password.value,
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const result = await response.json();

            if (response.ok) {
                messageContainer.style.color = 'green';
                messageContainer.textContent = 'Registration successful! Redirecting to login...';
                registerForm.reset();
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                messageContainer.style.color = 'red';
                const errorMsg = (result.errors && result.errors[0]) ? result.errors[0].message : 'Registration failed';
                messageContainer.textContent = `Error: ${errorMsg}`;
            }
        } catch (error) {
            console.error(error);
            messageContainer.style.color = 'red';
            messageContainer.textContent = 'An unexpected error occurred.';
        }
    });
});