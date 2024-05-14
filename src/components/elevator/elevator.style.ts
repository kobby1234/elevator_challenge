import styled from "styled-components";

export const Elevator = styled.img<{ $top: number ,speed :number}>`
  display: flex;
  top: ${(props) => props.$top}px;
  position: relative;  
  width: 100px;
  height: 100px;
  color: black;
  margin-bottom: 5px;
  margin-left: 20px;
  margin-right: 20px;
  transition: top ${(props) => props.speed}ms linear;
`;
