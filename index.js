const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3333;


// Kết nối file CSS
app.use(express.static(path.join(__dirname, 'public')));


// Tạo kết nối với cơ sở dữ liệu
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '', // Mật khẩu của bạn, mặc định là rỗng
  database: 'data', // Thay 'ten-csdl' bằng tên cơ sở dữ liệu bạn đã tạo
});

// Kết nối với cơ sở dữ liệu
connection.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối: ' + err.stack);
    return;
  }
  console.log('Kết nối thành công với cơ sở dữ liệu MySQL');
});

// Thiết lập template engine EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Thiết lập trình phân tích các trường trong yêu cầu
app.use(express.urlencoded({ extended: true }));

// Định nghĩa route GET
app.get('/', (req, res) => {
  res.render('menu');
});

// Định nghĩa route GET cho trang thêm người dùng
app.get('/add', (req, res) => {
  res.render('add_user');
});

// Định nghĩa route POST cho trang thêm người dùng
app.post('/add', (req, res) => {
  const { firstName, lastName, mobile, userName, password } = req.body;

  // Thực hiện câu lệnh INSERT để lưu dữ liệu vào cơ sở dữ liệu
  const query = 'INSERT INTO users (FirstName, LastName, Mobile, UserName, Password) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [firstName, lastName, mobile, userName, password], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn: ' + err.stack);
      res.status(500).send('Lỗi truy vấn cơ sở dữ liệu');
      return;
    }

    res.redirect('/list'); // Chuyển hướng về trang danh sách người dùng sau khi lưu thành công
  });
});

// Định nghĩa route GET cho trang danh sách người dùng
app.get('/list', (req, res) => {
  // Truy vấn cơ sở dữ liệu để lấy danh sách người dùng
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn: ' + err.stack);
      res.status(500).send('Lỗi truy vấn cơ sở dữ liệu');
      return;
    }

    res.render('user_list', { users: results });
  });
});

app.listen(port, () => {
  console.log(`Server đang lắng nghe trên cổng ${port}`);
});