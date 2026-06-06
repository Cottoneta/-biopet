const API_URL = 'http://localhost:3000';

//LOGIN 
async function handleLogin() {
    const email    = document.getElementById('log-email').value.trim();
    const password = document.getElementById('log-password').value;

    if (!email || !password) {
        showMsg('loginMsg', 'Por favor completa todos los campos.', 'error');
        return;
    }

    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.textContent = 'Ingresando...';

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('biopet_user', email);           // para contact.html
            localStorage.setItem('biopet_username', data.username); // para mostrar nombre
            showMsg('loginMsg', '¡Bienvenido! Redirigiendo...', 'success');
            setTimeout(() => window.location.href = 'index.html', 900);
        } else {
            showMsg('loginMsg', data.error || 'Credenciales inválidas.', 'error');
            btn.disabled = false;
            btn.textContent = 'Ingresar';
        }
    } catch (err) {
        showMsg('loginMsg', 'No se pudo conectar con el servidor.', 'error');
        btn.disabled = false;
        btn.textContent = 'Ingresar';
    }
}

// ── REGISTRO ──
async function handleRegister() {
    const username  = document.getElementById('reg-username').value.trim();
    const email     = document.getElementById('reg-email').value.trim();
    const password  = document.getElementById('reg-password').value;
    const password2 = document.getElementById('reg-password2').value;

    if (!username || !email || !password || !password2) {
        showMsg('registerMsg', 'Por favor completa todos los campos.', 'error');
        return;
    }
    if (password.length < 6) {
        showMsg('registerMsg', 'La contraseña debe tener al menos 6 caracteres.', 'error');
        return;
    }
    if (password !== password2) {
        showMsg('registerMsg', 'Las contraseñas no coinciden.', 'error');
        return;
    }

    const btn = document.getElementById('registerBtn');
    btn.disabled = true;
    btn.textContent = 'Creando cuenta...';

    try {
        const res = await fetch(`${API_URL}/registrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();

        if (res.ok) {
            showMsg('registerMsg', '¡Cuenta creada! Ahora inicia sesión 🐾', 'success');
            setTimeout(() => {
                showLogin();
                document.getElementById('log-email').value = email;
            }, 1500);
        } else {
            showMsg('registerMsg', data.error || 'Error al crear la cuenta.', 'error');
        }
    } catch (err) {
        showMsg('registerMsg', 'No se pudo conectar con el servidor.', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Crear cuenta';
    }
}

// ── RECURSO PROTEGIDO ──
async function verificarAccesoProtegido() {
    const token = localStorage.getItem('token');
    const el = document.getElementById('mensaje-protegido');
    if (!el) return;

    if (!token) {
        el.textContent = 'Debes iniciar sesión para acceder a este recurso.';
        el.style.color = 'red';
        return;
    }

    try {
        const res = await fetch(`${API_URL}/recurso-protegido`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok) {
            el.textContent = data.message + ' ' + data.data;
            el.style.color = 'green';
        } else {
            el.textContent = data.error || 'Acceso fallido.';
            el.style.color = 'red';
            if (res.status === 401 || res.status === 403) localStorage.removeItem('token');
        }
    } catch (err) {
        el.textContent = 'Error de red o servidor no disponible.';
        el.style.color = 'red';
    }
}

const botonAccesoProtegido = document.getElementById('acceso-protegido');
if (botonAccesoProtegido) {
    botonAccesoProtegido.addEventListener('click', verificarAccesoProtegido);
}

// ── HELPERS (usados desde login.html inline) ──
function showMsg(id, text, type) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = `msg ${type}`;
}

function showRegister() {
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('registerPanel').style.display = 'block';
    clearMsgs();
}

function showLogin() {
    document.getElementById('registerPanel').style.display = 'none';
    document.getElementById('loginPanel').style.display = 'block';
    clearMsgs();
}

function clearMsgs() {const API_URL = 'http://localhost:3000';

// ── LOGIN ──
async function handleLogin() {
    const email    = document.getElementById('log-email').value.trim();
    const password = document.getElementById('log-password').value;

    if (!email || !password) {
        showMsg('loginMsg', 'Por favor completa todos los campos.', 'error');
        return;
    }

    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.textContent = 'Ingresando...';

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('biopet_user', email);
            localStorage.setItem('biopet_username', data.username);
            showMsg('loginMsg', '¡Bienvenido! Redirigiendo...', 'success');
            setTimeout(() => window.location.href = '/inicio', 900); // ← ruta limpia
        } else {
            showMsg('loginMsg', data.error || 'Credenciales inválidas.', 'error');
            btn.disabled = false;
            btn.textContent = 'Ingresar';
        }
    } catch (err) {
        showMsg('loginMsg', 'No se pudo conectar con el servidor.', 'error');
        btn.disabled = false;
        btn.textContent = 'Ingresar';
    }
}

// ── REGISTRO ──
async function handleRegister() {
    const username  = document.getElementById('reg-username').value.trim();
    const email     = document.getElementById('reg-email').value.trim();
    const password  = document.getElementById('reg-password').value;
    const password2 = document.getElementById('reg-password2').value;

    if (!username || !email || !password || !password2) {
        showMsg('registerMsg', 'Por favor completa todos los campos.', 'error');
        return;
    }
    if (password.length < 6) {
        showMsg('registerMsg', 'La contraseña debe tener al menos 6 caracteres.', 'error');
        return;
    }
    if (password !== password2) {
        showMsg('registerMsg', 'Las contraseñas no coinciden.', 'error');
        return;
    }

    const btn = document.getElementById('registerBtn');
    btn.disabled = true;
    btn.textContent = 'Creando cuenta...';

    try {
        const res = await fetch(`${API_URL}/registrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();

        if (res.ok) {
            showMsg('registerMsg', '¡Cuenta creada! Ahora inicia sesión 🐾', 'success');
            setTimeout(() => {
                showLogin();
                document.getElementById('log-email').value = email;
            }, 1500);
        } else {
            showMsg('registerMsg', data.error || 'Error al crear la cuenta.', 'error');
        }
    } catch (err) {
        showMsg('registerMsg', 'No se pudo conectar con el servidor.', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Crear cuenta';
    }
}

// ── RECURSO PROTEGIDO ──
async function verificarAccesoProtegido() {
    const token = localStorage.getItem('token');
    const el = document.getElementById('mensaje-protegido');
    if (!el) return;

    if (!token) {
        el.textContent = 'Debes iniciar sesión para acceder a este recurso.';
        el.style.color = 'red';
        return;
    }

    try {
        const res = await fetch(`${API_URL}/recurso-protegido`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok) {
            el.textContent = data.message + ' ' + data.data;
            el.style.color = 'green';
        } else {
            el.textContent = data.error || 'Acceso fallido.';
            el.style.color = 'red';
            if (res.status === 401 || res.status === 403) localStorage.removeItem('token');
        }
    } catch (err) {
        el.textContent = 'Error de red o servidor no disponible.';
        el.style.color = 'red';
    }
}

const botonAccesoProtegido = document.getElementById('acceso-protegido');
if (botonAccesoProtegido) {
    botonAccesoProtegido.addEventListener('click', verificarAccesoProtegido);
}

// ── HELPERS ──
function showMsg(id, text, type) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = `msg ${type}`;
}

function showRegister() {
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('registerPanel').style.display = 'block';
    clearMsgs();
}

function showLogin() {
    document.getElementById('registerPanel').style.display = 'none';
    document.getElementById('loginPanel').style.display = 'block';
    clearMsgs();
}

function clearMsgs() {
    ['loginMsg', 'registerMsg'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = '';
        el.className = 'msg';
    });
}

function socialLogin(provider) {
    alert(`Login con ${provider} próximamente 🐾`);
}
    ['loginMsg', 'registerMsg'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = '';
        el.className = 'msg';
    });
}

function socialLogin(provider) {
    alert(`Login con ${provider} próximamente 🐾`);
}