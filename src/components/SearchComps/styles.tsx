import styled from "styled-components";

export const SearchResultStyle = styled.div`
  .section-buttons {
    button {
      margin: 0 5px;
      padding: 5px 10px;
      border-radius: 20px;
      background-color: #4f4fef;

      &.active {
        background-color: navy;
      }
    }
  }
`;

export const HeaderSearchStyle = styled.div`
  input {
    border: 1px solid black;
    width: 60% !important;

    @media ${(props) => props.theme.device.md} {
      width: 25vw !important;
    }
  }

  #search-label {
    border: 1px solid black;
  }
`;

export const UserSearchResultStyle = styled.div`
  a {
    &.user-details-links {
      font-family: ${(props) => props.theme.fonts.robotoRegular};
      color: ${(props) => props.theme.color.darkTeal};
    }
  }
`;
