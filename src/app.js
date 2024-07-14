const express = require('express');
const path = require('path');
const logger = require('./utils/logger');
const { validateLogin } = require('./middleware/validationMiddleware');
const errorHandler = require('./middleware/errorMiddleware');
require('dotenv').config();
const cors = require('cors');

const app = express();

var corsOptions = {
  origin: 'http://localhost:3000'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Sử dụng middleware để phục vụ các tệp tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, '../public')));

const db = require('./models');
const Role = db.role;

db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

function initial() {
  Role.create({
    id: 1,
    name: 'user'
  });

  Role.create({
    id: 2,
    name: 'moderator'
  });

  Role.create({
    id: 3,
    name: 'admin'
  });
}

// Route chính hiển thị file index.html
app.get('/', (req, res) => {
  logger.info('Hello world!');
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Route xử lý đăng nhập
app.post('/login', validateLogin, (req, res) => {
  // Logic xử lý đăng nhập
  res.json({ message: 'Login successful' });
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// Middleware xử lý lỗi
app.use(errorHandler);

const port = process.env.PORT || 3000;
// Lắng nghe server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
