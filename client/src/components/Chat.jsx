import React, { useEffect, useState ,useRef } from 'react'
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import decodeToken from './decodeToken';
import toTimeAgo from './Functions.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons'

export default function Chat() {
  
  const token = localStorage.getItem('token');
  const decodedToken = decodeToken(token);

  const { chatid, chatname } = useParams();

  const [creatorId, setCreatorId] = useState();
  const [chatName, setChatName] = useState();
  const [chatBody, setChatBody] = useState();
  const [comments, setComments] = useState([]);


  const [commBody, setCommBody] = useState();

  const bodyRef = useRef()



  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleBodyChange = (z) => {
    setCommBody(z);
  }


  const [replyBody, setReplyBody] = useState("");

  const handleReply = (event, id) => {
    const buttonParent = event.target.parentNode;
    const replyContainer = buttonParent.querySelector(".reply-container");
    if (!replyContainer) {
      const replyContainer = document.createElement("div");
      replyContainer.className = "reply-container";
      const replyInput = document.createElement("input");
      replyInput.className  = "reply-box"
      replyInput.type = "text";
      replyInput.placeholder = "Enter your reply";
      replyContainer.appendChild(replyInput);
      const replyBtn = document.createElement("button");
      replyBtn.className = "reply-btn";
      replyBtn.textContent = "Reply";
      replyBtn.addEventListener("click", () =>
        handleReplyConfirm(id, replyInput.value)
      );
      replyContainer.appendChild(replyBtn);
      buttonParent.appendChild(replyContainer);
    }
    document.querySelector(".reply").className = "hide";
    document.querySelector(".like-btn").className = "hide";
    document.querySelector(".like-btn").className = "hide";
    document.querySelector(".show-replies").className = "hide";
  };

  const handleReplyConfirm = (id, replyText) => {
    console.log(replyText)
    console.log(id);
    let userId = decodedToken.userId;
    let userName = decodedToken.userName;
    let date = new Date().toISOString().slice(0, 19).replace("T", " ");
    Axios.post("http://localhost:3001/create_comment", {
      user_id: userId,
      user_name: userName,
      body: replyText,
      parent: id,
      chat_id: chatid,
      currentDate: date,
    }).then((response) => {
      console.log(response);
      setReplyBody("");
    });
    document.querySelector(".reply-btn").className = 'hide';
    document.querySelector(".reply-box").className  = 'hide';
  };

  const createComment = () => {

    bodyRef.current.value = ''

    console.log(chatid)

    let userId = decodedToken.userId;
    let userName = decodedToken.userName;
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    Axios.post(('http://localhost:3001/create_comment'), {
      user_id: userId,
      user_name: userName,
      body: commBody,
      parent: 0,
      chat_id: chatid,
      currentDate: date
    }).then((response) => {
      console.log(response)
    })
  }

  

    
  useEffect(() => {
    Axios.post('http://localhost:3001/get_comments', {
      chat_id: chatid,
    }).then((response) => {
      if(response.data.result){
        setComments(response.data.result)
     }else{
        console.error('error getting quizzes')
      }
    })   
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/chats/${encodeURIComponent(chatid)}/${encodeURIComponent(chatname)}`);
        const data = response.data;
        setCreatorId(data.creatorId);
        setChatName(data.chatname);
        setChatBody(data.chatbody);
      } catch (error) {
        console.error('Error checking account:', error);
        // Handle error
      }
    };

    fetchData();
  }, [chatid, chatname]);



  function CommentsContainer() {
    const [showReplies, setShowReplies] = useState(false);
  
    const buildCommentTree = (comments, parentId = 0) => {
      const result = [];
      for (let comment of comments) {
        if (comment.parent_comment_id === parentId) {
          const children = buildCommentTree(comments, comment.id);
          if (children.length > 0) {
            comment.children = children;
          }
          result.push(comment);
        }
      }
      return result;
    };
  
    const commentTree = buildCommentTree(comments);

    const [showCommentReplies, setShowCommentReplies] = useState(false);
  
    const renderComment = (comment) => {
  
      const handleToggleReplies = () => {
        setShowCommentReplies(!showCommentReplies);
      };
  
      return (
        <Card className="comment" key={comment.comment_id}>
          <Container className="comm-main">
            <div className="circle">{comment.user_name[0]}</div>
            <Container className="text">
              <Card.Title className="comm">
                {comment.user_name},{" "}
                <span className="date">{toTimeAgo(comment.updated_at)}</span>
              </Card.Title>
              <Card.Text className="comm-body">{comment.body}</Card.Text>
              <Container className="utility">
                <Button className="show-replies" onClick={handleToggleReplies}>
                  {showCommentReplies ? "Hide replies" : "View replies"}
                </Button>
                <Button className="like-btn">
                  <FontAwesomeIcon icon={faThumbsUp} />
                </Button>
                <Button className="like-btn">
                  <FontAwesomeIcon icon={faThumbsDown} />
                </Button>
                <Button
                  onClick={(event) => handleReply(event, comment.id)}
                  className="reply"
                >
                  <FontAwesomeIcon icon={faComment} />
                  Reply
                </Button>
              </Container>
            </Container>
          </Container>
          {showCommentReplies && (
            <div className="replies-container">
              {comment.children && comment.children.map(renderComment)}
            </div>
          )}
        </Card>
      );
    };
  
    return <>{commentTree.map(renderComment)}</>;
  }


  return (
    <div className="page-wrapper chatting">
      <Container className="chats-chat-wrapper">
        <h1 className="title">{chatName}</h1>
        <p className="body">{chatBody}</p>


        <Container className="add-comment">
        <label htmlFor="">Add a comment</label>
        <textarea ref={bodyRef} onChange={(e) => handleBodyChange(e.target.value)} placeholder="Comment Body" className="main"/>

        <Button className="submit-comm" onClick={createComment}>Submit Comment</Button>

      </Container>

      <CommentsContainer/>

      </Container>
    </div>
  )
}
