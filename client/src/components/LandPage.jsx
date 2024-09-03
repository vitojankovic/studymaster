import React from 'react';
import { Link } from 'react-router-dom';
import Phone1 from '../images/phone1.webp'
import Phone2 from '../images/phone2.webp'
import Footer from './Footer'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';


// lottiefiles.com

export default function LandPage() {


  const [hasAccount, setHasAccount] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('token')){
      setHasAccount(true);
    }else{
      setHasAccount(false);
    }
    Aos.init({duration: 2000});
  },[]);

  return (
    <div className="land-page">
      <h1 data-aos="fade-up" className="land-title">
        Your <span className="goto">goto</span> study tool
      </h1>
      <p data-aos="fade-up" className="land-title">
        <span className="goto">Studymaster </span>
       is a free tool, users <br></br>create quizzes all can play, It also keeps <br></br>track of your progress <br></br> and rewards you based on it!
      </p>
      {hasAccount ? <></> :       <div className="button-create">
      <div className="button-create">
        <Link to="/register">
          <button data-aos="zoom-in" className="create-quiz-btn">
            Register
          </button>
        </Link>
      </div>

    </div>}

      <div className="circle-wrap">
       <div className="circle-main">
            <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
        </div>
      </div>

      
      {/*<Image className="main-img" src={Phone3}/>*/}


      <h1 className="land-title">Popular</h1>
      <Card data-aos="fade-left" className="quiz" >
        <Card.Img src={Phone1} alt="thumbnail 1" className="image">
        </Card.Img>
        <Card.Title className="title"> 
        Javascript and it's usage
        </Card.Title>
        <Card.Text className="title"> 
          This is a quiz about Javascript
        </Card.Text>
        <Button className="start">
          Play now
        </Button>
      </Card>

      <Card data-aos="fade-right" className="quiz" >
        <Card.Img src={Phone2} className="image" alt="Thumbnail 2">
        </Card.Img>
        <Card.Title className="title"> 
          C++ and it's usage
        </Card.Title>
        <Card.Text className="title"> 
          This is a quiz about C++
        </Card.Text>
        <Button className="start">
          Play now
        </Button>
      </Card>

      {/*<h1 data-aos="slide-left" className="land-title">
        You can create a <span className="goto">quiz</span>
      </h1>
      <div className="button-create">
        <Link to="/create">
          <button data-aos="zoom-in" className="create-quiz-btn">
            Create a quiz
          </button>
        </Link>
      </div>

      <h1 data-aos="slide-right" className="land-title">
        Browse <span className="goto">quizzes</span>
      </h1>
      <div className="button-create">
        <Link to="/library">
          <button data-aos="zoom-in" className="create-quiz-btn">
            Browse
          </button>
        </Link>
  </div>*/}


      {/*
      <Container className="description-long">
        <h1>Features</h1>
      </Container>
      */}
      

      <Footer />
    </div>
  )

}
