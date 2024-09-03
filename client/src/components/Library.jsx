import React from 'react';
import { useRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Aos from 'aos'
import 'aos/dist/aos.css'
import { useEffect, useState }  from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Axios from 'axios';
import QuestionMark from '../images/questionmark.jpg'

export default function Library() {

  const searchInput = useRef('');


  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [selectedField, setSelectedField] = useState('maths');

      
  useEffect(() => {
    Aos.init({duration: 3000});
  Axios.post('http://localhost:3001/get_quizzes').then((response) => {
    if(response.data.result){
      setQuizzes(response.data.result)
      setFilteredQuizzes(response.data.result)
    }else{
      console.error('error getting quizzes')
    }
  })
  },[]);

  const handleSearch = () => {
    const searchTerm = searchInput.current.value.toLowerCase();
    if (searchTerm === '') {
      setFilteredQuizzes(quizzes);
    } else {
      const filtered = quizzes.filter((quiz) => {
        return quiz.quiz_name.toLowerCase().includes(searchTerm) ||
               quiz.quiz_desc.toLowerCase().includes(searchTerm);
      });
      setFilteredQuizzes(filtered);
    }
  };

  const filterSearch = (e) => {
    setSelectedField(e)
    Axios.post('http://localhost:3001/get_fil_quizzes', {
      field: e
    }).then((response) => {
      if(response.data.result){
        setFilteredQuizzes(response.data.result)
      }else{
        console.error('error getting quizzes')
      }
    })
  }






  function QuizContainer(){

    return(
      <>
      {filteredQuizzes.map((quiz, index) => (
        <Card className="quiz">
          <Card.Img src={QuestionMark} className="image" alt="Cannot load"></Card.Img>
          <Card.Title className="title">{quiz.quiz_name}</Card.Title>
          <Card.Text className="title">{quiz.quiz_desc}</Card.Text>
          <Button href={`/quiz/${quiz.quiz_id}/${quiz.quiz_name}`} className="start">Play</Button>
        </Card>
      ))}
      </>
    )
  }

  //!! NEEDS FIXING, NOT UPDATING PROPERLY

  return (
    <div className="page-wrapper lib">
      <div className="library">
      <Form.Control className="search-quiz-input" type="text" ref={searchInput} onChange={handleSearch} placeholder="Search all quizzes" />
      <Form.Select value={selectedField} onChange={(e) => filterSearch(e.target.value)} className="select-filter-search">
          <option value="maths">Maths</option>
          <option value="language-grammar">Language_Grammar</option>
          <option value="general-knowledge">General_Knowledge</option>
          <option value="technology">Technology</option>
          <option value="sports">Sports</option>
          <option value="history">History</option>
          <option value="geography">Geography</option>
          <option value="literature">Literature</option>
          <option value="movies">Movies</option>
          <option value="animals">Animals</option>
          <option value="art">Art</option>
          <option value="food">Food</option>
          <option value="politics">Politics</option>
          <option value="other">Other</option>
        </Form.Select>
      <div className="quiz-container">
        <QuizContainer />
      </div>
      </div>
    </div>
  )
}
