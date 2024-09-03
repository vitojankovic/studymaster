const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require("mysql2");
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.set('trust proxy', 1);

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Middleware
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use environment variable for JWT secret key
const secretKey = process.env.JWT_SECRET_KEY;

// middleware
/*app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

var session;

app.get('/',function(req,res){
  sess=req.session;
  sess.email;
  sess.username;
});*/

app.post('/register', (req, res) => {

  const uName = req.body.user_name
  const uMail = req.body.user_mail
  const uPassword = req.body.user_password

  const sqlInsertUser = "INSERT INTO user (user_name, user_mail, user_password) VALUES (?, ?, ?)";
  const sqlInsertUserInfo = "INSERT INTO user_info (user_id) VALUES (?)";

  db.query(sqlInsertUser, [uName, uMail, uPassword], (err, result)=> {
    if (err) {
      console.log(err);
    } else {

      const userId = result.insertId;

      db.query(sqlInsertUserInfo, [userId], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          const payload = {
            userId: userId,
            userName: uName,
            userMail: uMail,
            userPassword: uPassword
          }

          const secretKey = 'hrewjhropwjh4o25pjhtejntewio';
          const token = jwt.sign(payload, secretKey); 

          res.json({ userId: userId, token: token });
        }
      });
    }
  });
});


app.post("/get_user_info", (req, res) => {
  const userId = req.body.userId;

  db.query(
    "SELECT * FROM user_info WHERE user_id = ?",
    [userId], (err, result) => {
      if(err){
        res.send({ err: err })
      }else{
        res.send({ result: result })
      }
    }
  )

})

app.post("/set_user_bio", (req, res) => {
  const userBio = req.body.bio;
  const userId = req.body.userId;
  
  db.query(
    "UPDATE user_info SET user_bio = (?) WHERE user_id = ?;", [userBio, userId], (err, result) => {
      if(err) res.send({ err:err })
      else res.send({ result: result })
    }
  )
})

app.post("/login", (req, res) => {

  const logmail = req.body.user_mail;
  const logpass = req.body.user_password;

  db.query(
    "SELECT * FROM user WHERE user_mail = ? AND user_password = ?",
    [logmail, logpass],
    (err, result) => {
      if(err){
        res.send({err: err})
      }
      if(result.length > 0){
        const user = result[0];

        const payload = { 
          userId: user.userid,
          userName: user.username,
          userMail: user.usermail,
          userPassword: user.userpassword,
        }
        
        const secretKey = '189i6ndhgwbhioywq'; // Replace with your own secret key
        const token = jwt.sign(payload, secretKey);

        res.send({ result: result, token: token });
      }else{
        res.send({message: "Wrong username/password combination!"})
      }
    }
  );
})

app.get('/account/:userid/:username', (req, res) => {

  const user_name = req.params.username;

  const sqlQuery = 'SELECT * FROM user WHERE user_name = ?';
  db.query(sqlQuery, [user_name], (err, result) => {
    if (err) {
      console.error(err);
      res.send({ error: 'Error checking account existence' });
    } if (result.length > 0) {
      // Account exists
      res.send({
        exists: true,
        userId: result[0].user_id,
        username: result[0].user_name,
        email: result[0].user_mail,
        password: result[0].user_password
      });
    } else {
      // Account doesn't exist
      res.send({ exists: false });
    }
  });
});

/*app.post('/account', (req, res) => {
  session = req.session;
  if(session){
    res.send(true);
  }else{
    res.send(true);
  }
})*/

app.post('/update_user', (req, res) => {
  const { user_name, user_mail, user_id, user_password } = req.body;

  const query = `UPDATE user SET user_mail = '${user_mail}', user_name = '${user_name}', user_password = '${user_password}' WHERE user_id = '${user_id}';`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error updating user table: ', err);
      res.status(500).send('Error updating user table');
    } else {
      console.log('User table updated successfully!');
      const payload = {
        userId: user_id,
        userName: user_name,
        userMail: user_mail,
        userPassword: user_password
      }
      const secretKey = 'hrewjhropwjh4o25pjhtejntewio';
      const token = jwt.sign(payload, secretKey);
      res.send({ token: token });
    }
  });
});

app.post('/update_user_info', (req, res) => {
  const { user_id, user_bio, profession, age } = req.body;

  const query = `UPDATE user_info SET user_bio = '${user_bio}', profession = '${profession}', age = '${age}' WHERE user_id = '${user_id}';`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error updating user_info table: ', err);
      res.status(500).send('Error updating user_info table');
    } else {
      console.log('User_info table updated successfully!');
      res.send('User_info table updated successfully!');
    }
  });
});

app.post('/quiz', (req, res) => {

  const Id = req.body.userId;
  const quizTitle = req.body.title;
  const quizDesc = req.body.description;
  const quizField = req.body.field;
  const quizData = req.body.questions;

  const sqlQuery = 'INSERT INTO quiz (creator_id, quiz_name, quiz_field, quiz_desc, quiz_data) VALUES (?, ?, ?, ?, ?)';
  db.query(sqlQuery, [Id, quizTitle, quizField, quizDesc, quizData], (err, result) => {
    if (err) {
      console.error(err);
      res.send({ error: 'Error' });
    }else{
      res.send({ result: result });
    }
  });
})


app.get('/quiz/:quizid/:quizname', (req, res) => {

  const quiz_name = req.params.quizname;

  const sqlQuery = 'SELECT * FROM quiz WHERE quiz_name = ?';
  db.query(sqlQuery, [quiz_name], (err, result) => {
    if (err) {
      console.error(err);
      res.send({ error: 'Error checking quiz existence' });
    } if (result.length > 0) {
      res.send({ 
        quizid: result[0].quiz_id,
        creatorId: result[0].creator_id,
        quizName: result[0].quiz_name,
        quizDesc: result[0].quiz_desc,
        quizData: JSON.parse(result[0].quiz_data)
      })
    }
  });
});


app.get('/chats/:chatid/:chatname', (req, res) => {

  const chat_id = req.params.chatid;

  const sqlQuery = 'SELECT * FROM chats WHERE id = ?';
  db.query(sqlQuery, [chat_id], (err, result) => {
    if (err) {
      console.error(err);
      res.send({ error: 'Error checking chat existence' });
    } if (result.length > 0) {
      res.send({
        chatid: result[0].id,
        chatname: result[0].title,
        chatbody: result[0].body,
      })
    }
  });
});


app.post('/get_quizzes', (req, res) => {
  const sqlQuery = 'SELECT * FROM quiz';
  db.query(sqlQuery, (err, result) => {
    if(err){
      console.error(err)
    }else{
    res.send({ result: result })
      console.log(result)
    }
  })
})


app.post('/get_comments', (req, res) => {

  const chat_id = req.body.chat_id;

  const sqlQuery = 'SELECT * FROM comments WHERE chat_id = ?';
  db.query(sqlQuery, [chat_id], (err, result) => {
    if(err){
      console.error(err)
    }else{
    res.send({ result: result })
      console.log(result)
    }
  })
})


app.post('/get_chats', (req, res) => {
  const sqlQuery = 'SELECT * FROM chats';
  db.query(sqlQuery, (err, result) => {
    if(err){  
      console.error(err)
    }else{
    res.send({ result: result })
      console.log(result)
    }
  })
})

app.post('/rank', (req, res) => {

  const field = req.body.field
  const score = req.body.score

  const sqlQuery = `ALTER TABLE user_stats ADD COLUMN ${field} INT`

  db.query(sqlQuery, (err, result) => {
    if(err) throw err
    console.log(`Added column ${field} to user_stats table`); 
  })

})


app.post('/get_fil_chats', (req, res) => {

  const field = req.body.field;

  const sqlQuery = 'SELECT * FROM chats WHERE (field) = ?';

  db.query(sqlQuery, [field], (err, result) => {
    if(err){
      console.error(err)
    }else{
    res.send({ result: result })
      console.log(result)
    }
  })
})

app.post('/get_fil_quizzes', (req, res) => {

  const field = req.body.field;

  const sqlQuery = 'SELECT * FROM quiz WHERE (quiz_field) = ?'
  
  db.query(sqlQuery, [field], (err, result) => {
    if(err){
      res.send(err)
    }else{
      res.send({
        result: result
      })
    }
  })
})

app.post('/create_post', (req, res) => {

  const user_id = req.body.user_id
  const user_name = req.body.user_name
  const title = req.body.title
  const field = req.body.field
  const body = req.body.body
  const created_at = req.body.currentDate

  const sqlQuery = 'INSERT INTO chats (user_id, user_name, title, field, body,created_at, updated_at) VALUES (?,?,?,?,?,?,?)';

  db.query(sqlQuery, [user_id, user_name, title, field, body, created_at, created_at], (err, result) => {
    if (err) {
      console.error(err);
      res.send({ error: 'Error checking quiz existence' });
    } else {
      res.send({
        result: result
      })
    }
  });
})


app.post('/create_comment', (req, res) => {

  const user_id = req.body.user_id
  const user_name = req.body.user_name
  const chat_id = req.body.chat_id
  const title = req.body.title
  const parent = req.body.parent
  const body = req.body.body
  const created_at = req.body.currentDate

  const sqlQuery = 'INSERT INTO comments (user_id, user_name, chat_id, body, created_at, updated_at, parent_comment_id) VALUES (?,?,?,?,?,?,?)';

  db.query(sqlQuery, [user_id, user_name, chat_id, body, created_at, created_at, parent], (err, result) => {
    if (err) {
      console.error(err);
      res.send({ error: 'Error checking quiz existence' });
    } else {
      res.send({
        result: result
      })
    }
  });
})


app.listen(3001, ()=> {
  console.log('Running on PORT 3001');
});