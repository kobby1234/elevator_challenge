import React from "react";
import * as Styles from "./elevator.style.ts";

class ElevatorCreator extends React.Component<ElevatorProps> {
  render(): JSX.Element {
    return (
      <>
        <Elevator
          floorNumber={this.props.floorNumber}
          elevatorId={this.props.elevatorId}
          isId={this.props.isId}
          manageElevatorQueue={this.props.manageElevatorQueue}
        />
      </>
    );
  }
}

interface ElevatorProps {
  floorNumber: number;
  elevatorId: number;
  isId: number;
  manageElevatorQueue: (floor: number, elvId: number) => void;
}

interface State {
  top: number;
  floorNumber: number;
  currentFloor: number;
  elevatorId: number;
  speed: number;
  isDirection: boolean;
}

class Elevator extends React.Component<ElevatorProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      top: 10,
      floorNumber: 0,
      currentFloor: 0,
      elevatorId: this.props.elevatorId,
      speed: 1,
      isDirection: true,
    };
  }

  componentDidUpdate(prevProps: ElevatorProps): void {
    if (
      this.props.floorNumber !== prevProps.floorNumber &&
      this.state.elevatorId === this.props.isId
    ) {
      this.elevatorManager();
    }
  }

  private elevatorManager = (): void => {
    const distance: number = this.movesElevator();
    this.modifyElevatorLocation(distance);
  };

  /**
   * updating the location of the elevator in delay of half second
   */
  private modifyElevatorLocation = (distance: number): void => {
    const delayBetweenActivations: number = 500;
    let activationsLeft: number = distance;
    let currentFloor: number = this.state.currentFloor;
    const activateWithDelay = (): void => {
      if (activationsLeft > 0) {
        if (this.state.isDirection) {
          currentFloor++;
        } else {
          currentFloor--;
        }
        this.props.manageElevatorQueue(currentFloor, this.state.elevatorId);
        activationsLeft--;
        setTimeout(activateWithDelay, delayBetweenActivations);
      }
    };
    setTimeout(activateWithDelay, delayBetweenActivations);
  };

  /**
   * move the elevator by setting new position
   * @returns the gap between the two floors
   */
  private movesElevator = (): number => {
    const floorDeparture: number = this.state.currentFloor;
    const floorArrival: number = this.props.floorNumber;
    let isDirection: boolean;
    let newTop: number = this.state.top;
    let distance: number = 0;
    distance = Math.abs(floorDeparture - floorArrival);
    if (floorDeparture < floorArrival) {
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

  render(): JSX.Element {
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
