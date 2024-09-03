import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUser, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../App';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Form from 'react-bootstrap/Form';
import decodeToken from './decodeToken';

export default function NavBar() {

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleClose = () => {
    setShowOffcanvas(false);
  };

  const handleOpen = () => {
    setShowOffcanvas(true);
  };


  const { mode, toggleMode } = useContext(ThemeContext);

  const token = localStorage.getItem('token');
  const decodedToken = decodeToken(token);
  


  const path = `/profile`;


  const [loggedIn, setLoggedIn] = React.useState(false);


  React.useEffect(() => {
    const check = () => {
      if (localStorage.getItem('token')) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        console.log("Doesn't");
      }
    };
    check();
  }, []);

  /* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
  let prevScrollpos = window.pageYOffset;
  const mediaQuery = window.matchMedia('(max-width: 500px)');
  if (!mediaQuery.matches) {
    window.onscroll = function () {
      let currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        setTimeout(function () {
          document.querySelector('.navigation-top').style = 'margin-top: 0;';
        }, 200);
      } else {
        setTimeout(function () {
          document.querySelector('.navigation-top').style = 'margin-top: -51px;';
        }, 100);
      }
      prevScrollpos = currentScrollPos;
    };
  }


  return (
    <Navbar className="navigation-top" expand="lg">
      <Container className="small-wrap">
          <Navbar.Brand className="logo mini" href="/">
            Name
          </Navbar.Brand>
          <div className="menu-button" onClick={handleOpen}></div>
        </Container>
      <Container>
        <Navbar.Brand className="logo" href="/">
          Name
        </Navbar.Brand>
        <Nav className="nav-wrapper">
          <Nav.Link href="/create">Create</Nav.Link>
          <Nav.Link href="/library">Browse</Nav.Link>
          <Nav.Link href="/chats">Chats</Nav.Link>
        </Nav>
        <Container className="sun-wrap">          
          <FontAwesomeIcon className={mode === 'light' ? "icon dark" : "icon light"} onClick={toggleMode} icon={mode === 'light' ? faMoon : faSun} />
          {loggedIn ? (
            <Link to={path}>
              <FontAwesomeIcon className="icon user" icon={faUser} />
            </Link>
          ) : (
            <Button className="login-register-navbar" href="/register">
              Register
            </Button>
          )}
        </Container>
      </Container>




          <Offcanvas className="phone-navbar" show={showOffcanvas} onHide={handleClose}>
            <Offcanvas.Body className="phone-main">
              <Container className="routes">
                <Nav.Link href="/" className="np-title"><h1>Home</h1></Nav.Link>
                <Nav.Link href="/create" className="np-title"><h1>Create</h1></Nav.Link>
                <Nav.Link href="/library" className="np-title"><h1>Browse</h1></Nav.Link>
                <Nav.Link href="/premium" className="np-title"><h1>Premium</h1></Nav.Link>
                <Nav.Link href="/lessons" className="np-title"><h1>Lessons</h1></Nav.Link>
                <Button href="/register" className="login-register-navbar">Register</Button>
                <Button href="/login" className="login-register-navbar">Login</Button>
                              <Form.Check
                type="switch"
                id="custom-switch"
                label={mode === 'light' ? 'Light Mode' : 'Dark Mode'}
              >
                <Form.Switch
                  checked={mode === 'dark'}
                  onChange={toggleMode}
                  id="custom-switch"
                  label=""
                />
              </Form.Check>
              </Container>
            </Offcanvas.Body>
          </Offcanvas>

    </Navbar>
  );
}