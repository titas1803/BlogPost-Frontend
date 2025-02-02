import styled from "styled-components";

export const LoginSignupRightBlockStyle = styled.div`
  h1 {
    font: normal 600 32px/36px ${(props) => props.theme.fonts.robotoRegular};
  }
  p {
    a {
      font: normal 600 24px/28px ${(props) => props.theme.fonts.robotoItalic};
    }
  }
`;
