import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { LoginForm } from "./LoginForm";
import { Link } from "react-router-dom";
import { LoginSignupRightBlock } from "../LoginSignupRightBlock";
import { useSearchParams } from "react-router-dom";

export const LoginTab: React.FC = () => {
  const [searchParams] = useSearchParams();
  return (
    <Container>
      <Row>
        <Col md={6}>
          <LoginForm />
        </Col>
        <LoginSignupRightBlock>
          <h2>Create a accout.</h2>
          <p>
            <Link to={`/signup?${searchParams}`}>Signup now!</Link>
          </p>
        </LoginSignupRightBlock>
      </Row>
    </Container>
  );
};
