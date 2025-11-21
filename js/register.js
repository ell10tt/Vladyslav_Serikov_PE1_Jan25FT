document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register__form');
    const messageContainer = document.getElementById('message__container');

    const apiUrl = 'https://v2.api.noroff.dev/auth/register';

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
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
                messageContainer.textContent = 'Registration successful! Please log in.';
                registerForm.reset();
            } else {
                messageContainer.textContent = `Error: ${result.errors[0].message}`;
            }
        } catch (error) {
            messageContainer.textContent = 'error';
        }
    });
});