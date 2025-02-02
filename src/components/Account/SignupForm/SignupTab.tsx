import React from "react";
import { SignupProvider } from "./context/SignupProvider";
import { SignupFormStyle } from "./styles";
import { FromCarousel } from "./Forms/FromCarousel";
import { Link, useSearchParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { LoginSignupRightBlock } from "../LoginSignupRightBlock";

export const SignupForm: React.FC = () => {
  const [searchParams] = useSearchParams();

  return (
    <SignupProvider>
      <SignupFormStyle className="p-4">
        <Container>
          <Row>
            <Col md={6}>
              <FromCarousel />
            </Col>
            <LoginSignupRightBlock>
              <h2>Already have a account?</h2>
              <p>
                <Link to={`/login?${searchParams}`}>Login now!</Link>
              </p>
            </LoginSignupRightBlock>
          </Row>
        </Container>
      </SignupFormStyle>
    </SignupProvider>
  );
};
