import styled from "styled-components";

export const FloorWrapper = styled.div`
  display: flex;
`;

export const Floor = styled.div`
  background-color: silver;
  background-image: linear-gradient(335deg, #b00 23px, transparent 23px), 
                    linear-gradient(155deg, #d00 23px, transparent 23px), 
                    linear-gradient(335deg, #b00 23px, transparent 23px), 
                    linear-gradient(155deg, #d00 23px, transparent 23px);
  background-size: 58px 58px;
  background-position: 0px 2px, 4px 35px, 29px 31px, 34px 6px;
  height: 103px;
  width: 250px;
  border-top: solid 3.5px #000;
  border-bottom: solid 3.5px #000;
  border-left: solid 4px #000;
  border-right: solid 4px #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FloorButton = styled.button<{isColor: boolean}>`
  width: 100px;
  font-size: 4em;
  height: 80px;
  border-radius: .5em;
  background-image: -webkit-repeating-linear-gradient(left, hsla(0,0%,100%,0) 0%, hsla(0,0%,100%,0) 6%, hsla(0,0%,100%, .1) 7.5%), 
                    -webkit-repeating-linear-gradient(left, hsla(0,0%, 0%,0) 0%, hsla(0,0%, 0%,0) 4%, hsla(0,0%, 0%,.03) 4.5%), 
                    -webkit-repeating-linear-gradient(left, hsla(0,0%,100%,0) 0%, hsla(0,0%,100%,0) 1.2%, hsla(0,0%,100%,.15) 2.2%), 
                    linear-gradient(180deg, hsl(0,0%,78%) 0%, hsl(0,0%,90%) 47%, hsl(0,0%,78%) 53%, hsl(0,0%,70%)100%);
  color: ${props => (props.isColor ? '#008000'  : '#000')};
  justify-content: center;
  cursor: pointer;
`;

export const Timer = styled.div`
    display: flex;
    width: 40px;
    height: 40px;
    color: black;
    font-size: 30px;
    margin-top: 35px;
    justify-content: center;
    margin-left: 5px;
    font: bold;
`;
