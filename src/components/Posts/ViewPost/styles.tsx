import styled from "styled-components";

export const ViewPostStyles = styled.div`
  background-color: #fff;

  .userdetails {
    .user-details-links {
      a {
        font-family: ${(props) => props.theme.fonts.robotoRegular};
        color: ${(props) => props.theme.color.darkTeal};

        small {
          font-family: ${(props) => props.theme.fonts.robotoItalic};
        }
      }
    }
  }

  .post-speeddial-icon-fab {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    box-shadow: none;
    width: fit-content;
    height: fit-content;
    display: flex;
    align-items: center;

    &:hover,
    &:focus {
      background-color: transparent;
    }
  }
`;

export const ImageCarousel = styled.div`
  img {
    width: 100%;
    height: auto;
  }
`;
