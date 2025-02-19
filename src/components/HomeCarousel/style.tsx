import styled from "styled-components";

export const HomeCarouselStyle = styled.div`
  .author-slides {
    height: 200px;
    border-radius: 10px;
    background-color: aliceblue;

    > img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }

    .swiper-slide-shadow-coverflow {
      border-radius: 10px;
    }

    div.author-slide-content {
      position: absolute;
      bottom: 10px;
      right: 10px;
      font-family: ${(props) => props.theme.fonts.robotoRegular};
      flex-direction: column-reverse;

      @media ${(props) => props.theme.device.md} {
        flex-direction: row;
      }
      p {
        color: white;

        a {
          color: white;
          font-family: ${(props) => props.theme.fonts.robotoRegular};

          &.username {
            font-family: ${(props) => props.theme.fonts.robotoItalic};
          }
        }
      }

      img {
        background-color: ${(props) => props.theme.color.borderGray};
        width: 90px;
        aspect-ratio: 1;
        border: 2px solid ${(props) => props.theme.color.borderGray};
        border-radius: 50%;
      }
    }
  }
`;
