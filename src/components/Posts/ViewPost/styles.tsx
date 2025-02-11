import styled from "styled-components";

export const ViewPostStyles = styled.div`
  background-color: #fff;

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
