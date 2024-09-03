import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import Container from 'react-bootstrap/Container'

export default function Premium() {
  return (
    <div className="prem-wrapper">
      <Container className="container-prem">
        <h1 className="prem-title">Free</h1>
        <p>• Create Quizzes</p>
        <p>• Play free quizzes</p>
        <p>• Join free communities</p>
      </Container>
      <Container className="container-prem">
        <h1 className="prem-title">Premium</h1>
        <p>• Create premium Quizzes</p>
        <p>• Play premium quizzes</p>
        <p>• Join premium communities</p>
      </Container>
      <Container className="container-prem">
        <h1 className="prem-title">Deluxe</h1>
      </Container>
    </div>
  )
}
