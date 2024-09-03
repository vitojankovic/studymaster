import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import Navbar from "react-bootstrap/Navbar"
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import toTimeAgo from './Functions.js'

export default function Communities() {


  const [chats, setChats] = useState([])
  const [selectedField, setSelectedField] = useState('maths');
  const [filteredChats,  setFilteredChats] = useState([]);

  useEffect(() => {
    // Aos.init({duration: 3000});
  Axios.post('http://localhost:3001/get_chats').then((response) => {
    if(response.data.result){
      setChats(response.data.result)
      setFilteredChats(response.data.result)
    }else{
      console.error('error getting quizzes')
    }
  })
  },[]);

  const handleFilterChange = (e) => {
    setSelectedField(e)
    Axios.post('http://localhost:3001/get_fil_chats', {
      field: e
    }).then((response) => {
      if(response.data.result){
        setChats(response.data.result)
        setFilteredChats(response.data.result)
      }else{
        console.error('error getting quizzes')
      }
    })
  }


  function ChatContainer(){

    const navigate = useNavigate();

    function handleClick(id, title) {
      navigate(`/chat/${id}/${title}`);
    }
    
    return(
      <Container className="chat-container">
        {filteredChats.map((chat, index) => (
            <Card onClick={() => handleClick(chat.id, chat.title)} className="chat">
              <Container className="post-heading">
                <Card.Title className="chat-title">{chat.field}</Card.Title>
                <Container className="post-info">
                  <Card.Title  className="chat-title date">Posted {toTimeAgo(chat.created_at)}  by &nbsp;</Card.Title>
                  <Card.Title className="chat-title name">{chat.user_name}</Card.Title>
                </Container>
              </Container>
              <Card.Title className="chat-title main">{chat.title}</Card.Title>
              <Card.Text className="chat-text">{chat.body}</Card.Text>
            </Card>
      ))}
      </Container>
    )
  }

  return (
    <div className="page-wrapper for-chat">


    <ChatContainer />

      <Navbar className="sidebar">
        <Nav.Link className="sidebar-link">Active</Nav.Link>
        <div className="border-bottom"></div>
        <h1 className="sidebar-link">Topics</h1>
        <Form.Select value={selectedField} onChange={(e) => handleFilterChange(e.target.value)} className="input">
        <option value="">Any</option>
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
        <div className="border-bottom"></div>
        <Button href="/submit" className="create-comm">Create</Button>
      </Navbar>

    </div>
  )
}
