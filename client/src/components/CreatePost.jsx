import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Axios from 'axios'
import decodeToken from './decodeToken';

export default function CreatePost() {


  const [selectedField, setSelectedField] = useState('Maths');

  
  const token = localStorage.getItem('token');
  const decodedToken = decodeToken(token);


  const [title, setTitle] = useState()
  const [body, setBody] = useState()

  const handleTitleChange = (z) => {
    setTitle(z)
  }

  const handleBodyChange = (z) => {
    setBody(z)
  }

  const createPost = () => {

    let userId = decodedToken.userId;
    let userName = decodedToken.userName;
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    console.log(selectedField)

    Axios.post(('http://localhost:3001/create_post'), {
      user_id: userId,
      user_name: userName,
      title: title,
      field: selectedField,
      body: body,
      currentDate: date
    }).then((response) => {
      console.log(response)
    })

  }

  return (
    <div className="quiz-wrapper">
        <Container className="d-flex flex-column align-items-Container justify-content-sb quiz-container-new">
        <h1 className="create-quiz-title">Create a Post</h1>
        <Form.Control
        type="text"
        placeholder="Post Title"
        className="input"
        onChange={(e) => handleTitleChange(e.target.value)}
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
        <textarea onChange={(e) => handleBodyChange(e.target.value)} placeholder="Enter the Post Body" className="input special"/>

        <Button onClick={createPost}>Submit Post</Button>

        </Container>
    </div>
  )
}
