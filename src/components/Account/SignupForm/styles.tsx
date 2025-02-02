import styled from "styled-components";

export const SignupFormStyle = styled.div`
  .carousel {
    .carousel-indicators {
      bottom: auto;
      margin-bottom: 10px;
    }
    .carousel-item {
      min-height: 410px;
    }

    h2.form-heading {
      text-align: center;
      color: white;
    }

    .back-btn {
      width: 100px;
      height: 35px;
      background: linear-gradient(to top, #00154c, #116864, #1a666b);
      color: #fff;
      border-radius: 50px;
      border: none;
      outline: none;
      cursor: pointer;
      position: relative;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      overflow: hidden;

      span {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: top 0.5s;

        &.btn-text-one {
          font-size: 24px;
          position: absolute;
          width: 100%;
          top: 50%;
          left: 0;
          transform: translateY(-60%);
        }

        &.btn-text-two {
          position: absolute;
          width: 100%;
          top: 150%;
          left: 0;
          transform: translateY(-50%);
        }
      }

      &:hover {
        .btn-text-one {
          top: -100%;
        }
        .btn-text-two {
          top: 50%;
        }
      }
    }

    form {
      &.details-form,
      &.password-form {
        label {
          color: gray;
        }
      }

      input {
        border-radius: 0;
      }

      button {
        &.show-password {
          border: 0;
          position: absolute;
          right: 0;
          height: 100%;
        }

        &.submit {
          margin-top: 15px;
          background-color: #1b7c89;
          padding: 10px 20px;
          /* width: 9em;
          height: 3em; */
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
            height: 100%;
            border-radius: 30em;
            position: absolute;
            top: 0;
            left: 0;
            background-image: linear-gradient(
              to right,
              #0fd850 0%,
              #f9f047 100%
            );
            transition: 0.5s ease;
            display: block;
            z-index: -1;
          }

          &:hover::before {
            width: 100%;
          }
        }
      }

      span {
        &.required-asterisk {
          color: red;
        }
      }

      .form-error {
        text-align: left !important;
        color: ${(props) => props.theme.color.sunset};
      }

      .flex-fields-wrapper {
        @media ${(props) => props.theme.device.lg} {
          > div {
            width: 95%;
          }
          > div:not(:last-child) {
            margin-right: 10px;
          }
        }
      }
    }
  }
`;
