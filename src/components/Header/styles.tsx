import styled from "styled-components";

export const HeaderStyle = styled.header`
  nav {
    padding: 0;

    .navbar-brand {
      img {
        width: 130px;
        height: auto;

        @media ${(props) => props.theme.device.md} {
          width: 200px;
        }
      }
    }

    .login-btn,
    .create-btn {
      font: normal normal 16px / 18px
        ${(props) => props.theme.fonts.robotoItalic};
      color: #fff;
      background-color: ${(props) => props.theme.color.btnBlue};
      box-shadow: 0px 0px 15px 0px rgba(133, 133, 133, 0.75);

      &:hover {
        background-color: rgba(50, 76, 168, 0.75);
      }

      @media ${(props) => props.theme.device.md} {
        font-size: 22px;
        line-height: 24px;
      }
    }
  }
`;
