import React, { useEffect } from 'react'
import { useState } from "react";
import { useRef } from 'react'
import Axios from 'axios'
import Aos from 'aos'
import 'aos/dist/aos.css'
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { useParams } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css"
import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container'
import decodeToken from './decodeToken';

export default function Account() {
  
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [primaryFeatures, setPrimaryFeatures] = useState(false);


  const token = localStorage.getItem('token');
  const decodedToken = decodeToken(token);


  
  const { userid, username } = useParams()


  const userId7 = decodedToken.userId;


  const [name, setName] = useState(decodedToken.userName);
  const [email, setEmail] = useState(decodedToken.userMail);
  const [password, setPassword] = useState(decodedToken.userPassword);
  const [bio, setBio] = useState('');
  const [profession, setProfession] = useState('');
  const [age, setAge] = useState('');


  
  useEffect(() => {
    Axios.post('http://localhost:3001/get_user_info', {
      userId: userId7,
    }).then((response) => {
      let vuff = response.data.result[0];
      setBio(vuff.user_bio)
    })
  }, [userId7])

  const handleFormSubmit = (event) => {
    event.preventDefault();

    console.log(userId7)
  
    // Update user table
    Axios.post('http://localhost:3001/update_user', {
      user_name: name,
      user_mail: email,
      user_id: decodedToken.userId,
      user_password: password
    })
    .then((response) => {
      localStorage.removeItem('token')
      localStorage.setItem('token', response.data.token)
    })
    .catch(error => console.error(error));
  
      // Update user_info table
      Axios.post('http://localhost:3001/update_user_info', {
        user_id: userId7,
        user_bio: bio,
        profession: profession,
        age: age
      })
      .then(response => console.log(response.data))
      .catch(error => console.error(error));
  }


  const [accountExists, setAccountExists] = useState(false)

  useEffect(() => {
    Aos.init({duration: 1000});
    setTimeout(() => {
      Aos.refresh();
    }, 500);
  // Make an API request to check if the account exists
  Axios.get(`http://localhost:3001/account/${encodeURIComponent(userid)}/${encodeURIComponent(username)}`)
    .then((response) => {
      if (response.data.exists) {
        // Account exists
        setAccountExists(true);

        //!!!!! WORLD RECORD STUPIDEST JAVASCRIPT BUG EVER, SOLUTION: IMPOSSIBLE
      } else if (!response.data.exists) {
        // Account doesn't exist
        setAccountExists(false);
        // setUserId('');
      }
    })
    .catch((error) => {
      console.error('Error checking account:', error);
      // Handle error
    });
}, [userid, username]);



useEffect(()=>{
  if(username === decodedToken.userName){
    setPrimaryFeatures(true)
  }
}, [decodedToken]);

  const [hasAcc, modifyAcc] = useState(false);


  const circle = useRef();

  // Account component
  // Random boja za slike
  // Inicijali

 const labels = ["Maths", "English", "Science", "Computer Science", "History", "Philosophy"];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "AVG. Mark per field",
        backgroundColor: [
          "#007D9C",
          "#244D70",
          "green",
          "gray",
          "darkgray",
          "#FE452A",
        ],
        borderColor: "rgb(255, 99, 132)",
        data: [95, 90, 80, 100, 75, 65],
      },
    ],
  };

  const labels2 = ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "1.10"]

  const data2 = {
    labels: labels2,
    datasets: [
      {
        label: "Overtime improvement",
        backgroundColor: [
          "orange"
        ],
        borderColor: "rgb(255, 99, 132)",
        data: [95, 90, 80, 100, 75, 65],
      },
    ],
  };

  const logOut = () => {
    localStorage.removeItem('token');
  }


  //!!! https://www.youtube.com/watch?v=blf1z9w6cHA


  if(accountExists){
    return(
      <div className="account-page">
        <div data-aos="zoom-out" className="circle" ref={circle} >
          {username[0]}
        </div>
        <h1 data-aos="fade-right" className="name">
          {username}
        </h1>
          <div className="desc-wrapper"><p data-aos="fade-left" className="bio">
            { bio }
          </p>

          {primaryFeatures ? <Button onClick={handleShow} data-aos="zoom-in" className="edit-btn">
              EDIT PROFILE
          </Button> : <></>}
          
          
          </div>


<Offcanvas show={show} onHide={handleClose} className="edit-user">
        <Container className="d-flex flex-column align-items-Container justify-content-sb quiz-container-new">
          <Offcanvas.Title className="title">
            EDIT PROFILE
          </Offcanvas.Title>

          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder='Username'
                value={name}
                className="input"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              className="input"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              className="input"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

            <Form.Group controlId="bio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter bio"
                value={bio}
                className="input"
                onChange={(e) => setBio(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="profession">
              <Form.Label>Profession</Form.Label>
              <Form.Select
                className="input"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              >
                <option value="">Select profession</option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="writer">Writer</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="age">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter age"
                value={age}
                className="input"
                onChange={(e) => setAge(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Container>
      </Offcanvas>

      </div>
    )
  }
  else{

    /*
      <Form.Control className="edit-input" value={decodedToken.userName}>

    </Form.Control>
    <Form.Control className="edit-input" value={decodedToken.userMail}>
      
    </Form.Control>
    <Form.Control className="edit-input" type="password" value={decodedToken.userPassword}>
      
    </Form.Control>
    */

    return(
      <h1>Account doesn't exist</h1>
    )
  }
  
    /*<button className="log-out-button" onClick={()=> logOut()}>
    Log out
  </button>*/

}