import styled from "styled-components";

export const Elevator = styled.img<{ $top: number ,speed :number}>`
  top: ${(props) => props.$top}px;
  border: 2px solid black;
  position: relative;  width: 100px;
  height: 100px;
  color: black;
  background-color: gray;
  margin-bottom: 10px;
  transition: top ${(props) => props.speed}ms linear;
`;
