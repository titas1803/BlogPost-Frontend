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
  }

  #search-label {
    border: 1px solid black;
  }
`;
