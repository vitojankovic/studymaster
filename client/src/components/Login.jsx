import React from 'react'
import { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {


  const navigate = useNavigate();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = () => {
    console.log("Works!")
    if (email !== '' || password !== '') {
      Axios.post('http://localhost:3001/login', {
        user_mail: email,
        user_password: password
      }).then((response) => {
        if (response.data.message) {
          console.log('No account!');
        } else {
          console.table(response.data.result)
          console.log('Yes account!');
          const userId = response.data.result[0].user_id;
          const userName = response.data.result[0].user_name;
          if(localStorage){
            localStorage.clear();
            localStorage.setItem('token', response.data.token);
          }
          else{
            localStorage.setItem('token', response.data.token);
          }
          navigate(`/profile/${userId}/${userName}`);
        }
      })
    }
    else{
      alert('Fill in the information please!')
    }
  }

  return (
    <div className="page-wrapper">
      <Form className="login-page">
      <Container className="input-wrapper">
        <Form.Control type="text" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Form.Control type="password" className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button className="submit-form" onClick={handleLogin}>
        Submit
      </Button>
      </Container>
      <Container className="reg-click">
        Don't have an account? <Button className="other-option-btn" href="/register">Create one</Button>
      </Container>
    </Form>
  </div>
  )
}
