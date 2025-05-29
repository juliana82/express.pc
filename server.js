const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs'); // hash passwords
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; // JWT secret key

const dbConfig = {
  host: process.env.DB_HOST || 'localhost:3307',
      port: parseInt(process.env.DB_PORT) || 3307, // <--- MUITO IMPORTANTE: use parseInt() para garantir que seja um número
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'expresspcTeste', // replace with your database name
};

let dbConnection;

async function connectToDatabase() {
  try {
    dbConnection = await mysql.createConnection(dbConfig);
    console.log('Connected to the database');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit the application if the database connection fails
  }
};

// Start the connection with the database
connectToDatabase();


// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('public')); // Serve static files from the 'public' directory


// Routes

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch user from the database
    const [rows] = await dbConnection.execute(
      'SELECT id, username, password FROM users WHERE username = ?',
      [username]
    );

    if (rows.lenghth === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

      const user = rows[0];

      // Compare password with hashed password in the database
      const isPassswordValid = await bcrypt.compare(password, user.password);
      if(isPassswordValid) {
        const token = jwt.sign({
          id: user.id,
          username: user.username,
          role: user.role,
          name: user.name
        }, SECRET_KEY,
        {
          expiresIn: '1h' // Token expiration time
        });
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict'
        });
        res.json({
          success: true,
          role: user.role,
          name: user,name
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      } 
  } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if(!token) {
    return res.status(401).redirect('/');
  }
  req.user = decoded;
  next();
}

// Route to panels
app.get('/dashboard/admin', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') {
    res.sendFile(__dirname + '/public/admin.html');
  } else {
    res.status(403).send('Access denied');
  }
});

app.get('/dashboard/professor', authenticateToken, (req, res) => {
  if (req.user.role === 'professor') {
    res.sendFile(__dirname + '/public/professor.html');
  } else {
    res.status(403).send('Access denied');
  }
});

app.get('/dashboard/suporte', authenticateToken, (req, res) => {
  if (req.user.role === 'suporte') {
    res.sendFile(__dirname + '/public/funcionario.html');
  } else {
    res.status(403).send('Access denied');
  }
});

// Route to logout
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});