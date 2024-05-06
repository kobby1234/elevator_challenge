import React from "react";
import * as Styles from "./elevator.ts";

interface PropsElevator {
  floorNumber: number;
  elevatorId: number;
  isId: number;
  modifyCurrentElevator: (floor: number, elvId: number) => void;
}
class ElevatorCreator extends React.Component<PropsElevator> {
  render() {
    return (
      <>
        <Elevator
          floorNumber={this.props.floorNumber}
          elevatorId={this.props.elevatorId}
          isId={this.props.isId}
          modifyCurrentElevator={this.props.modifyCurrentElevator}
        />
      </>
    );
  }
}
interface State {
  top: number;
  floorNumber: number;
  currentFloor: number;
  elevatorId: number;
  speed: number;
  prevFloor: number;
  isDirection: boolean;
}

class Elevator extends React.Component<PropsElevator, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      top: 10,
      floorNumber: 0,
      currentFloor: 0,
      elevatorId: this.props.elevatorId,
      speed: 1,
      isDirection: true,
      prevFloor: 0,
    };
  }

  componentDidUpdate(prevProps: PropsElevator) {
    // Check if the floorNumber prop has changed
    // console.log("console.log(",this.props.floorNumber,prevProps.floorNumber,"##",this.state.elevatorId,this.props.isId)
    if (
      this.props.floorNumber !== prevProps.floorNumber &&
      this.state.elevatorId === this.props.isId
    ) {
      this.elevatorManager();
    }
  }

  private elevatorManager = (): void => {
    // const prevTop: number = this.state.top;
    const distance: number = this.movesElevator();
    this.modifyElevatorLocation(distance);
    // console.log("speed of id", this.state.elevatorId, "  ", this.state.speed);
  };

  modifyElevatorLocation = (distance: number) => {
    const delayBetweenActivations: number = 500;
    let activationsLeft: number = distance;
    let currentFloor: number = this.state.currentFloor;
    // console.log(
    //   "numberOfActivations",
    //   activationsLeft,
    //   this.state.currentFloor
    // );
    const activateWithDelay = () => {
      if (activationsLeft > 0) {
        if (this.state.isDirection) {
          currentFloor++;
        } else {
          currentFloor--;
        }
        // console.log("currentFloor", currentFloor, this.state.prevFloor);
        this.props.modifyCurrentElevator(currentFloor, this.state.elevatorId);
        activationsLeft--;
        setTimeout(activateWithDelay, delayBetweenActivations);
      }
    };
    setTimeout(activateWithDelay, delayBetweenActivations);
  };

  private movesElevator = (): number => {
    const num1: number = this.state.currentFloor;
    const num2: number = this.props.floorNumber;
    let isDirection: boolean;
    // console.log("handleClick called with floorNumber:", this.props.floorNumber);
    let newTop: number = this.state.top;
    let distance: number = 0;
    this.setState({ prevFloor: num1 });
    // sourcery skip: dont-self-assign-variables
    distance = Math.abs(num1 - num2);
    if (num1 < num2) {
      isDirection = true;
      newTop -= distance * 110;
    } else {
      newTop += distance * 110;
      isDirection = false;
    }

    this.setState({
      top: newTop,
      speed: distance * 500,
      isDirection: isDirection,
      currentFloor: this.props.floorNumber,
    });

    return distance;
  };
  render() {
    return (
      <Styles.Elevator
        src="/elv.png"
        alt=""
        $top={this.state.top}
        speed={this.state.speed}
      ></Styles.Elevator>
    );
  }
}

export default ElevatorCreator;
