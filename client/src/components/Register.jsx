import React from 'react'
import { useRef, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'


export default function Register() {
  
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email ,setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const handleRegister = () => {
    if(username !== '' && email !== '' && password !== ''){
      Axios.post('http://localhost:3001/register', {
        user_name: username,
        user_mail: email,
        user_password: password
      }).then((response) => {
        const userid = response.data.userId;
        const token = response.data.token;
        localStorage.setItem('token', token);
        console.log('OK')
        navigate(`/profile/${userid}/${username}`)
        try { 
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      }).catch(err => {
        console.log("HELL")
        console.log(err);
      });
    }else{
      alert('Fill in the information please!');
    }
  };


  return (
    <div className="page-wrapper">
      <Form className="login-page">
      <Container className="input-wrapper">
        <Form.Control type="text" className="input" placeholder="Name" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Form.Control type="text" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <Form.Control type="password" className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button className="submit-form" onClick={handleRegister}>
        Submit
      </Button>
      </Container>
      <div className="reg-click">
        Already have an account? <Button className="other-option-btn" href="/login">Log in</Button>
      </div>
    </Form>
  </div>
  )
}
