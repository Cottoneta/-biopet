require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const path    = require('path');
const { createClient } = require('@supabase/supabase-js');
const authenticateToken = require('./middleware/autenticacion_middleware');

const app = express();
app.use(express.json());
app.use(cors());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ══════════════════════════════════════════
//  REDIRIGIR .html → ruta limpia
// ══════════════════════════════════════════
app.use((req, res, next) => {
    if (req.path.endsWith('.html')) {
        const cleanPath = req.path.slice(0, -5) || '/';
        return res.redirect(301, cleanPath);
    }
    next();
});

// ══════════════════════════════════════════
//  RUTAS LIMPIAS
// ══════════════════════════════════════════
// ══════════════════════════════════════════
//  RUTAS LIMPIAS
// ══════════════════════════════════════════
app.get('/',         (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/inicio',   (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login',    (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/contacto', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.get('/pets',     (req, res) => res.sendFile(path.join(__dirname, 'public', 'pets.html')));


// Archivos estáticos (CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// ══════════════════════════════════════════
//  REGISTRO  →  POST /registrar
//  Body: { username, email, password }
// ══════════════════════════════════════════
app.post('/registrar', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'El nombre de usuario, correo y contraseña son requeridos.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'El formato del correo electrónico no es válido.' });
        }

        const { data: existingEmail } = await supabase
            .from('usuarios')
            .select('id')
            .eq('email', email)
            .single();

        if (existingEmail) {
            return res.status(409).json({ error: 'Este correo ya está registrado.' });
        }

        const { data: existingUser } = await supabase
            .from('usuarios')
            .select('id')
            .eq('username', username)
            .single();

        if (existingUser) {
            return res.status(409).json({ error: 'Este nombre de usuario ya está en uso.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { error } = await supabase
            .from('usuarios')
            .insert([{ username, email, password: hashedPassword }]);

        if (error) {
            console.error('Error durante el registro:', error);
            return res.status(500).json({ error: 'El registro de usuario falló.' });
        }

        res.status(201).json({ message: 'Usuario registrado correctamente.' });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// ══════════════════════════════════════════
//  LOGIN  →  POST /login
//  Body: { email, password }
//  Devuelve: { token, username }
// ══════════════════════════════════════════
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'El correo y contraseña son requeridos.' });
        }

        const { data: user, error } = await supabase
            .from('usuarios')
            .select('id, username, email, password')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const token = jwt.sign(
            { username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Inicio de sesión exitoso!',
            token,
            username: user.username,
            email: user.email
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// ══════════════════════════════════════════
//  RECURSO PROTEGIDO (ejemplo)
// ══════════════════════════════════════════
app.get('/recurso-protegido', authenticateToken, (req, res) => {
    res.status(200).json({
        message: `Bienvenido al recurso protegido, ${req.user.username}!`,
        data: 'Esta información es sólo para usuarios autenticados.'
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});