import styled from "styled-components";

export const LoginFormStyle = styled.div`
  h2.form-heading {
    color: white;
  }

  input {
    border-radius: 0%;
  }

  button {
    &.show-password {
      border: 0;
      position: absolute;
      right: 0;
      height: 100%;
    }

    &.submit {
      background-color: #1b7c89;
      width: 9em;
      height: 3em;
      border-radius: 30em;
      font-size: 15px;
      font-family: inherit;
      border: none;
      position: relative;
      overflow: hidden;
      z-index: 1;
      box-shadow: 6px 6px 12px #125c66, -6px -6px 12px #125c66;

      &::before {
        content: "";
        width: 0;
        height: 3em;
        border-radius: 30em;
        position: absolute;
        top: 0;
        left: 0;
        background-image: linear-gradient(to right, #0fd850 0%, #f9f047 100%);
        transition: 0.5s ease;
        display: block;
        z-index: -1;
      }

      &:hover::before {
        width: 9em;
      }
    }
  }

  span {
    &.required-asterisk {
      color: red;
    }
  }
  .form-error {
    color: ${(props) => props.theme.color.sunset};
  }
`;
