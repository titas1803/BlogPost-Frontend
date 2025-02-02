import styled from "styled-components";

export const AddPostStyles = styled.div`
  .add-btn-container {
    background-color: #fff;

    .profile-link {
      img {
        border-radius: 50%;
      }
    }

    .on-your-mind-btn {
      height: 40px;
      border: 2px solid #a6a6a6;
      color: #585858;
      background-color: #fff;
      border-radius: 30px;
      overflow: hidden;

      @media ${(props) => props.theme.device.md} {
        height: 50px;
      }

      &:hover {
        background-color: #e7e7e7;
      }
    }
  }
`;
