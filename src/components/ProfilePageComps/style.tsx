import styled from "styled-components";

export const ProfilePageBannerStyle = styled.div<{ $bgImage: string }>`
  background: url(${(props) => props.$bgImage}) center/cover;
  border-radius: 10px;
  max-width: 100%;

  aspect-ratio: 1.5;

  @media ${(props) => props.theme.device.md} {
    aspect-ratio: 4;
  }

  .profile-bio {
    font: normal 600 22px/24px ${(props) => props.theme.fonts.robotoRegular};
    height: 80%;
    width: 75%;
    align-content: center;
    letter-spacing: normal;

    @media ${(props) => props.theme.device.md} {
      width: 65%;
      font-size: 35px;
      line-height: 40px;
    }
  }

  .btn-section {
    top: 5px;
    right: 0;
  }
`;

export const ProfileCardStyle = styled.div`
  width: max-content;
  top: -50px;

  @media ${(props) => props.theme.device.md} {
    border: 4px solid ${(props) => props.theme.color.borderGray};
    border-radius: 15px;
    box-shadow: 2px 2px 11px 2px rgba(92, 91, 92, 1);
    top: -63px;
    background-color: rgba(255, 255, 255, 0.75);
  }

  .profile-photo {
    width: max-content;

    .img-div {
      background-color: #fff;
      border: 4px solid #a6a6a6;
      border-radius: 50%;
      width: max-content;

      button {
        border-radius: 50%;
        background-color: transparent;

        .profile-photo-img {
          width: 75px;
          height: 75px;
          border-radius: 50%;

          @media ${(props) => props.theme.device.md} {
            width: 100px;
            height: 100px;
          }
        }
      }
    }

    .update-image-btn {
      background-color: #fff;
      opacity: 0.5;
      bottom: -5px;
      right: -5px;

      &:hover {
        opacity: 0.75;
      }
    }
  }

  .profile-details {
    max-width: 432px;
    min-width: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .profile-name {
      h3 {
        font: normal 500 30px / 35px
          ${(props) => props.theme.fonts.robotoRegular};
      }
    }

    .profile-username {
      font: normal 500 21px / 28px ${(props) => props.theme.fonts.robotoItalic};

      button {
        border: 0;
        background-color: transparent;
        padding: 3px;
      }
    }

    .profle-noOfSubs {
      font: normal 400 21px / 28px ${(props) => props.theme.fonts.robotoRegular};

      span {
        &.noOfSubs-text {
          font-size: 24px;
          line-height: 28px;
          font-weight: 600;
        }
      }
    }

    .profle-noOfSubTo {
      font: normal 400 21px / 28px ${(props) => props.theme.fonts.robotoRegular};

      span {
        &.noOfSubTo-text {
          font-size: 24px;
          line-height: 28px;
          font-weight: 600;
        }
      }
    }
  }
`;

export const SubscibedUserListStyle = styled.div`
  div.user-card {
    border: 2px solid black;
    padding: 15px 10px;
    border-radius: 15px;

    button {
      &.profile-image-btn {
        border-radius: 50%;
        border: 4px solid ${(props) => props.theme.color.borderGray};
        width: max-content;

        img {
          width: 100px;
          aspect-ratio: 1;
          border-radius: 50%;
        }
      }
    }
  }
`;
