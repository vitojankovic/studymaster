import React, { useRef, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Axios from 'axios';
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import decodeToken from './decodeToken';


export default function Quiz() {

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const decodedToken = decodeToken(token);

  const { quizid, quizname } = useParams();

  const [creatorId, setCreatorId] = useState('');
  const [quizName, setQuizName] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizField, setQuizField] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0); // What is current question
  const [correct, setCorrect] = useState(0); // Correct answers

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/quiz/${encodeURIComponent(quizid)}/${encodeURIComponent(quizname)}`);
        const data = response.data;
        setCreatorId(data.creatorId);
        setQuizName(data.quizName);
        setQuizDescription(data.quizDesc);
        setQuizData(data.quizData);
        setQuizField(data.quizField);
        setLoading(false);
      } catch (error) {
        console.error('Error checking account:', error);
        // Handle error
      }
    };

    fetchData();
  }, [quizid, quizname]);

  const loadNextQuestion = (answer) => {
    let real;
    console.log(answer)
    if(!quizData[count].correctAnswerIndex){
      real = 1;
      console.log(real, '/', answer)
    }else{
      real = parseInt(quizData[count].correctAnswerIndex)+1;
      console.log(real, '/', answer)
    }
    if (answer === real) {
      setCorrect(correct + 1);
    } 
    setCount(count => count + 1);
  };
  
  

  function Question({ question }) {

    const answerRefs = useRef([]);

    const [userAnswers, setUserAnswers] = useState([]);

    const handleAnswerClick = (index) => {
      answerRefs.current.forEach((ref, i) => {
        if (i === index) {
          ref.style.backgroundColor = 'green';
          setUserAnswers((prevUserAnswers) => [...prevUserAnswers, ref.current])
          console.log(userAnswers)
        } else {
          ref.style.backgroundColor = '';
        }
      });
    };

    if (!question) {
      return <div>Loading...</div>;
    }

    return (
      <div className="page-wrapper">
      <div className="Question">
        <div className="question-main">
          <div className="question-container">
            <h1 className="question-title">{question.question}</h1>

            <div className="options-container">
              {question.answers &&
                question.answers.map((answer, index) => (
                  <div className="Answer">
                    <h1

                      key={index}
                      ref={(ref) => (answerRefs.current[index] = ref)}
                      onClick={() => handleAnswerClick(index)}
                    >
                      {answer}
                    </h1>
                  </div>
                ))}
            </div>

            <button
              className="next-question"
              onClick={() =>
                loadNextQuestion(
                  answerRefs.current.findIndex((ref) => ref.style.backgroundColor === 'green') + 1
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
      </div>
    );
  }

  function Result({ length, correct }) {
    const score = ((correct / length) * 100).toFixed(2);

    const handleDone = () => {
      Axios.post('http://localhost:3001/rank', {
        field: quizField,
        score: score,
      }).then((response) => {
        console.log(response)
      })
      navigate(`/`);
    }

    return (
      <div className="page-wrapper">
      <div className="Result">
        <div className="quiz">
          <h1 className="Mark">
            {correct}/{length}
          </h1>

          <h1 className="Mark">{score}%</h1>

          <Button onClick={() => {
            handleDone()
          }} className="login-register-navbar" style={{ width: '50% !important;' }}>Continue</Button>
        </div>
      </div>
    </div>
    );
  }

  if (loading) {
    return <div className="red">Loading...</div>;
  } else if (count < quizData.length) {
    return <Question question={quizData[count]} />;
  } else {
    return <Result length={quizData.length} correct={correct} />;
  }
}