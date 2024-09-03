import React, { useState } from 'react';
import '../styles/style.css';
import Axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css"
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert';
import decodeToken from './decodeToken';

export default function CreatePage() {


  const [show, setShow] = useState(false);

  

  const token = localStorage.getItem('token');
  const decodedToken = decodeToken(token);

  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [questions, setQuestions] = useState([{ question: '', answers: ['', ''] }]);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answers: ['', ''] }]);
  };

  const addAnswer = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].answers.push('');
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index, question) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = question;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (index, answerIndex, answer) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].answers[answerIndex] = answer;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (index, correctAnswerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctAnswerIndex = correctAnswerIndex;
    setQuestions(updatedQuestions);
  };


  const createQuiz = async () => {

    console.log(JSON.stringify(questions))


    const userId = decodedToken.userId;

    try {
      const response = await Axios.post('http://localhost:3001/quiz', {
        userId: userId,
        title: quizTitle,
        description: quizDescription,
        field: selectedField,
        questions: JSON.stringify(questions)
      });
      console.log(response.data);
      setShow(true);
      // Do something with the response if needed
    } catch (error) {
      console.log(error);
      // Handle error if necessary
    }
  };

  return (
    <div className="quiz-wrapper">
    <Container className="d-flex flex-column align-items-Container justify-content-sb quiz-container-new">
      <h1 className="create-quiz-title">Create Quiz</h1>
      <Form.Control
        type="text"
        placeholder="Quiz Title"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        className="input"
      />
      <Form.Control
        placeholder="Quiz Description"
        value={quizDescription}
        onChange={(e) => setQuizDescription(e.target.value)}
        className="input"
      />

      <Form.Select value={selectedField} onChange={(e) => setSelectedField(e.target.value)} className="input">
        <option value="maths">Maths</option>
        <option value="language-grammar">Language_Grammar</option>
        <option value="general-knowledge">General_Knowledge</option>
        <option value="technology">Technology</option>
        <option value="sports">Sports</option>
        <option value="history">History</option>
        <option value="geography">Geography</option>
        <option value="literature">Literature</option>
        <option value="movies">Movies</option>
        <option value="technology">Technology</option>
        <option value="animals">Animals</option>
        <option value="art">Art</option>
        <option value="food">Food</option>
        <option value="politics">Politics</option>
        <option value="other">Other</option>
      </Form.Select>

      {questions.map((question, index) => (
        <Container key={index} className="q-container">
          <Form.Control
            type="text"
            className="input"
            placeholder={`Question ${index + 1}`}
            value={question.question}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
          />

          {question.answers.map((answer, answerIndex) => (
            <Form.Control
              key={answerIndex}
              type="text"
              className="input"
              placeholder={`Answer ${answerIndex + 1}`}
              value={answer}
              onChange={(e) => handleAnswerChange(index, answerIndex, e.target.value)}
            />
          ))}
          <Button onClick={() => addAnswer(index)}>Add Answer</Button>

          <label>
            Correct Answer:
            <select
              value={question.correctAnswerIndex}
              onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
            >
              {question.answers.map((_, answerIndex) => (
                <option key={answerIndex} value={answerIndex}>
                  Answer {answerIndex + 1}
                </option>
              ))}
            </select>
          </label>
        </Container>
      ))}

      <Button onClick={addQuestion}>Add Question</Button>
      <Button onClick={createQuiz}>Create Quiz</Button>
    </Container>


    <Alert show={show} variant="success" className="alert-success">
      <Alert.Heading>Quiz succesfully created</Alert.Heading>
      <p>
        If you are seeing this message, that means that your quiz has been successfully created, if you want to play it, click PLAY
      </p>
    </Alert>
    
    </div>
  );
}