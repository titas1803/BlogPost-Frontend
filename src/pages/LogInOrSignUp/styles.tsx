import styled from "styled-components";

export const LoginOrSignupStyle = styled.div`
  width: 80%;
  height: 100%;
  align-items: center;
  margin: 20px auto;

  div.w-100 {
    border-radius: 14px;
    box-shadow: 14px 18px 30px -14px rgba(94, 94, 94, 0.77);
  }

  /* @media ${(props) => props.theme.device.md} {
    width: 55%;
  }
  @media ${(props) => props.theme.device.xl} {
    width: 35%;
  } */

  ul.nav-tabs {
    li.nav-item:first-child {
      button {
        border-radius: 14px 0 0 0;
      }
    }
    li.nav-item:last-child {
      button {
        border-radius: 0 14px 0 0;
      }
    }

    button {
      color: black;
      background-color: ${(props) => props.theme.color.lightCyan};
      border: 0;

      &.nav-link {
        &.active {
          font-weight: bold;
          background-color: ${(props) => props.theme.color.darkTeal};
        }
      }
    }
  }

  .tab-content {
    background: linear-gradient(
      90deg,
      rgba(2, 0, 36, 1) 0%,
      rgba(27, 124, 137, 1) 0%,
      rgba(186, 255, 255, 0.9921218487394958) 100%
    );
    border-radius: 0 0 14px 14px;
    padding: 5px;
  }
`;
