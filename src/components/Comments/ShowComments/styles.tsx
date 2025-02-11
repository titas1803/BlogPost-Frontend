import styled from "styled-components";

export const ShowCommentsStyle = styled.div``;
export const CommentStyle = styled.div`
  .MuiSpeedDial-fab {
    background-color: transparent;
    padding: 0;
    width: max-content;
    height: fit-content;
    border: 0;
    border-radius: 0;
    box-shadow: none;

    &:hover {
      border: 0;
      border-radius: 0;
      box-shadow: none;
      background-color: transparent;
    }

    &:focus {
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }

    > span {
      display: flex;
      align-items: center;
    }
  }
`;
