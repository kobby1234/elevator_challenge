import React from "react";
import Floor from "./floor.tsx";
import * as Styles from "./building.ts";
import Elevator from "./alevator.tsx";
import { Dict } from "styled-components/dist/types";
const soundFilePath: string = require("../images/ding.mp3") as string;
const audio = new Audio(soundFilePath);

interface Props {
    numberOfFloors: number;
    numberOfElevators: number;
}

interface State {
  // floorNumber: boolean[];
  numbers: Dict[];
  numberOfElevator: number[];
  listOfElevators: number[][];
  orderedFloor: number;
  elevatorId: number;
  floorColor: boolean;
  floorId: number;
  floorTimer: number
}

class Building extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    const numberOfElevators = this.props.numberOfElevators;
    const length = this.props.numberOfFloors;
    const initialFloorNumber = Array.from({ length: length }, (_, index) =>
      index === 0 || index === length ? false : true
    );
    const initialNumber = Array.from(
      { length },
      (_, index) => length - index - 1
    );

    this.state = {
      // floorNumber: initialFloorNumber,
      numbers: initialNumber.map((key, index) => ({
        [key]: initialFloorNumber[index],
      })),
      numberOfElevator: Array.from(
        { length: numberOfElevators },
        (_, index) => index
      ),
      listOfElevators: Array.from({ length: numberOfElevators }, () => [0]),
      orderedFloor: 0,
      elevatorId: 0,
      floorColor: false,
      floorId: -1,
      floorTimer: 0,
    };

    // console.log("this.state.listOfElevators", this.state.listOfElevators);
    // console.log("this.state.numbers", this.state.numbers);
    // this.state.numbers.map((floor, index) =>(
    //     console.log("##",Number(Object.keys(floor)[0]))
    // ))

    
  }

  renderFloors = () => {
    
    return this.state.numbers.map((floor, index) => (
      <Floor
        key={index}
        floorId={Number(Object.keys(floor)[0])}
        isId = {this.state.floorId}
        isColor = {this.state.floorColor}
        isFloor={floor[Object.keys(floor)[0]]}
        floorNumber={Number(Object.keys(floor)[0])}
        orderElevator={this.orderElevator}
        timer={this.state.floorTimer}
      />
    ));
  };
  renderElevator = () => {
    return this.state.numberOfElevator.map((index) => (
      <Elevator
        key={index}
        floorNumber={this.state.orderedFloor}
        elevatorId={index}
        isId={this.state.elevatorId}
        // handelRemovingFloor={this.removeFloorFromLIst}
        modifyCurrentElevator={this.modifyCurrentElevator}
      />
    ));
  };
  orderElevator = (floor: number): void => {
    let isFloorAlreadyOrdered: boolean = false
    for (var i = 0; i < this.state.listOfElevators.length; i++) {
        if (this.state.listOfElevators[i].includes(floor)){
            isFloorAlreadyOrdered = true
          break;
        }
      }
    if(!isFloorAlreadyOrdered){
        let seconds = this.algorithm(floor);
        this.setState({floorColor: true, floorId: floor, floorTimer: seconds});
        console.log("RRRRRRRRRRRR",this.state.listOfElevators)
    }
  };
  
    modifyCurrentElevator = async(floor: number, elvId:number) => {
        console.log("floor",floor,"this.state.listOfElevators[elvId][1]",this.state.listOfElevators[elvId][1])
        if(floor === this.state.listOfElevators[elvId][1]){
            audio.pause();
            audio.currentTime = 0;
            audio.play()
            setTimeout(() => {
                
    
                this.setState({floorColor: false, floorId: floor})
                const listOfElevators:number[][] = JSON.parse(JSON.stringify(this.state.listOfElevators));
                listOfElevators[elvId].shift()
                this.setState({
                listOfElevators: listOfElevators
                }, () => {
                    console.log("modifyCurrentEl", this.state.listOfElevators);
                });
                console.log("this.state.listOfElevators[elvId].length",this.state.listOfElevators[elvId].length,"##",this.state.listOfElevators[elvId][2])
                if(this.state.listOfElevators[elvId].length > 2){
                    this.setState({ elevatorId: elvId, orderedFloor: this.state.listOfElevators[elvId][2]});
                }
            }, 2000) 
        }
        else{
            const listOfElevators:number[][] = JSON.parse(JSON.stringify(this.state.listOfElevators));
            listOfElevators[elvId][0] = floor;
            this.setState({
                listOfElevators: listOfElevators
            }, () => {
                console.log("modifyCurrentElevator", this.state.listOfElevators);
            });
        }
    }

  algorithm = (floor: number): number => {
    let minimum: number = 1000;
    let elevatorIndex: number = -1;
    let copyList: number[][] = JSON.parse(JSON.stringify(this.state.listOfElevators))
    let isMinimum: number = 0;
    copyList.map((elv, index) => {
      isMinimum = 0;
      elv.push(floor);
      for (let i = 0; i < elv.length - 1; i++) {
        isMinimum += (Math.abs(elv[i] - elv[i + 1]) ) * 1 / 2;
      }if(elv.length > 2){
        isMinimum += (elv.length - 2) * 2
      }
      if (isMinimum < minimum) {
        minimum = isMinimum;
        elevatorIndex = index;
      }
    });
    if (elevatorIndex !== -1) {
        const listOfElevators:number[][] = JSON.parse(JSON.stringify(this.state.listOfElevators));
        listOfElevators[elevatorIndex].push(floor);
        this.setState({
          listOfElevators: listOfElevators
        });
      }
      console.log(" if(this.state.listOfElevators[elevatorIndex].length < 3)",this.state.listOfElevators[elevatorIndex])
          console.log("minimum",minimum)
      if(this.state.listOfElevators[elevatorIndex].length < 2){
           this.setState({ elevatorId: elevatorIndex, orderedFloor: floor});
      }
   return minimum
  };
  
  render() {
    return (
      <Styles.Container>
          
              <Styles.Building >
                    {this.renderFloors()}
                    </Styles.Building>
                
        
       
        <Styles.ElevatorsWrapper>
                {this.renderElevator()}
            </Styles.ElevatorsWrapper>
      </Styles.Container>
    );
  }
}

export default Building;
