import styled from "styled-components";

export const HomeStyle = styled.div`
  width: 90%;

  @media ${(props) => props.theme.device.md} {
    wdith: 75%;
  }
`;
