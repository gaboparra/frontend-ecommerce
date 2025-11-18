// Show message
function showMessage(elementId, message, type) {
    const messageEl = document.getElementById(elementId);
    messageEl.textContent = message;
    messageEl.classList.add('show', type);
    
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 5000);
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
            showMessage('loginMessage', data.message || '¡Inicio de sesión exitoso!', 'success');
            
            // Store the token in localStorage
            localStorage.setItem('token', data.payload.token);
            localStorage.setItem('user', JSON.stringify(data.payload.user));
            
            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
            
        } else {
            showMessage('loginMessage', data.message || 'Error al iniciar sesión', 'error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showMessage('loginMessage', 'Error de conexión. Verifica tu red.', 'error');
    }
}