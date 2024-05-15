import React from "react";
import FloorCreator from "../floor/floor.tsx";
import * as Styles from "./building.style.ts";
import ElevatorCreator from "../elevator/elevator.tsx";

class BuildingCreator extends React.Component<BuildingProps> {
  render(): JSX.Element {
    return (
      <Building
        numberOfFloors={this.props.numberOfFloors}
        numberOfElevators={this.props.numberOfElevators}
      />
    );
  }
}

interface BuildingProps {
  numberOfFloors: number;
  numberOfElevators: number;
}

interface BuildingState {
  elevators: number[];
  queueOfElevators: number[][];
  elevatorId: number;
  orderedFloor: number;
  adjustingElevatorWait: number[];
  floors: number[];
  floorColor: boolean;
  floorId: number;
  floorTimer: number;
  audio: HTMLAudioElement;
}

class Building extends React.Component<BuildingProps, BuildingState> {
  constructor(props: BuildingProps) {
    super(props);
    const elevatorsNumber: number = this.props.numberOfElevators;
    const floorsNumber: number = this.props.numberOfFloors;
    this.state = {
      floors: Array.from({ length: floorsNumber }, (_, index) => index),
      elevators: Array.from({ length: elevatorsNumber }, (_, index) => index),
      queueOfElevators: Array.from({ length: elevatorsNumber }, () => [0]),
      adjustingElevatorWait: Array.from({ length: elevatorsNumber }, () => 0),
      orderedFloor: 0,
      elevatorId: 0,
      floorColor: false,
      floorId: -1,
      floorTimer: 0,
      audio: new Audio("./ding.mp3"),
    };
  }

  renderFloors = (): JSX.Element[] => {
    return this.state.floors.map((floor, index) => (
      <FloorCreator
        key={index}
        isId={this.state.floorId}
        isColor={this.state.floorColor}
        floorNumber={floor}
        orderElevator={this.orderElevator}
        timer={this.state.floorTimer}
      />
    ));
  };

  renderElevator = (): JSX.Element[] => {
    return this.state.elevators.map((index) => (
      <ElevatorCreator
        key={index}
        floorNumber={this.state.orderedFloor}
        elevatorId={index}
        isId={this.state.elevatorId}
        manageElevatorQueue={this.manageElevatorQueue}
      />
    ));
  };

  /**
   *  adds floor to elevator queue
   *- if there is no other floors waiting it activate the elevator
   * @param floor
   */
  public orderElevator = (floor: number): void => {
    const isFloorAlreadyOrdered: boolean = this.isFloorOrdered(floor);
    if (!isFloorAlreadyOrdered) {
      let time: number = this.manageElevatorOrder(floor);
      this.setState({ floorColor: true, floorId: floor, floorTimer: time });
    }
  };

  /**
   * manage the movement of the elevator
   * @param floor
   * @param elevatorId
   */
  public manageElevatorQueue = (floor: number, elevatorId: number) => {
    // if elevator arrived at the floor
    if (floor === this.state.queueOfElevators[elevatorId][1]) {
      this.playAudio();
      this.adjustingElevatorTwoSecondWait(elevatorId);
      this.manageElevatorArrival(floor, elevatorId);

      // elevator doesn't arrived at the floor
    } else {
      this.updateElevatorPosition(elevatorId, floor);
    }
  };

  /**
   * waits two seconds and then
   * - sets the color of the floor back to black
   * - sets "adjustingElevatorWait" to zero
   * - remove the floor from elevator queue
   * - if there is a floor waiting in the queue activates the elevator
   * @param floor
   * @param elevatorId
   */
  private manageElevatorArrival = (floor: number, elevatorId: number): void => {
    setTimeout(() => {
      let copyList: number[] = this.state.adjustingElevatorWait;
      copyList[elevatorId] = 0;

      this.setState({
        floorColor: false,
        floorId: floor,
        adjustingElevatorWait: copyList,
      });
      this.removeFloorFromQueue(elevatorId);
      // if there is a floor waiting in the queue
      if (this.state.queueOfElevators[elevatorId].length > 2) {
        this.sendElevator(
          elevatorId,
          this.state.queueOfElevators[elevatorId][2]
        );
      }
    }, 2000);
  };

  /**
   * finds the best elevator and add the floor to the elevator queue
   * - if there is no other floors waiting it activate the elevator
   * @param floor
   * @returns amount of time to get to the floor
   */
  private manageElevatorOrder = (floor: number): number => {
    const [elevatorId, time]: number[] = this.chooseElevator(floor);
    this.addFloorToQueue(floor, elevatorId);
    // if there is no other floors waiting
    if (this.state.queueOfElevators[elevatorId].length < 2) {
      this.sendElevator(elevatorId, floor);
    }
    return time;
  };

  /**
   * check if the ordered floor is already in the queue
   * @param floor
   * @returns boolean indication
   */
  private isFloorOrdered = (floor: number): boolean => {
    let listOfElevators: number[][] = JSON.parse(
      JSON.stringify(this.state.queueOfElevators)
    );
    let isFloorAlreadyOrdered: boolean = false;
    for (var index = 0; index < listOfElevators.length; index++) {
      // if elevator is on the move
      if (listOfElevators[index].length > 1) {
        // allowing to add the first floor in the queue to the queue
        listOfElevators[index].shift();
      }
      // if floor is already in the elevator queue
      if (listOfElevators[index].includes(floor)) {
        isFloorAlreadyOrdered = true;
        break;
      }
    }
    return isFloorAlreadyOrdered;
  };

  /**
   * choose the elevator that has the shortest time to get to the floor
   * @param floor
   * @returns elevator id, time to get to the floor
   */
  private chooseElevator = (floor: number): number[] => {
    let minimum: number = 1000;
    let isMinimum: number = 0;
    let elevatorIndex: number = -1;
    let copyQueue: number[][] = JSON.parse(
      JSON.stringify(this.state.queueOfElevators)
    );
    // iterate the elevator queue and add the floor to the elevators queue
    copyQueue.forEach((elevatorQueue, index) => {
      isMinimum = 0;
      elevatorQueue.push(floor);

      for (let i = 0; i < elevatorQueue.length - 1; i++) {
        // add the half second for each floor
        isMinimum += Math.abs(elevatorQueue[i] - elevatorQueue[i + 1]) / 2;
      }
      // correcting the time when the elevator waits two seconds
      isMinimum -= this.state.adjustingElevatorWait[index];
      if (elevatorQueue.length > 2) {
        // add the to seconds for each stops
        isMinimum += (elevatorQueue.length - 2) * 2;
      }
      if (isMinimum < minimum) {
        minimum = isMinimum;
        elevatorIndex = index;
      }
    });

    return [elevatorIndex, minimum];
  };

  /**
   * adds the floor to the end of the elevator queue
   * @param floor
   * @param elevatorId
   */
  private addFloorToQueue = (floor: number, elevatorId: number): void => {
    const listOfElevators: number[][] = JSON.parse(
      JSON.stringify(this.state.queueOfElevators)
    );
    listOfElevators[elevatorId].push(floor);
    this.setState({
      queueOfElevators: listOfElevators,
    });
  };

  /**
   * remove the first floor from the elevator queue
   * @param elevatorIndex
   */
  private removeFloorFromQueue = (elevatorIndex: number): void => {
    const listOfElevators: number[][] = JSON.parse(
      JSON.stringify(this.state.queueOfElevators)
    );
    listOfElevators[elevatorIndex].shift();
    this.setState({ queueOfElevators: listOfElevators });
  };

  /**
   * sends elevator by triggering rerender of the elevator class
   * @param elevatorIndex
   * @param floor
   */
  private sendElevator = (elevatorId: number, floor: number): void => {
    this.setState({ elevatorId: elevatorId, orderedFloor: floor });
  };

  /**
   * updating the current location of the elevator
   * @param elvId
   * @param floor
   */
  private updateElevatorPosition = (elvId: number, floor: number): void => {
    const listOfElevators: number[][] = JSON.parse(
      JSON.stringify(this.state.queueOfElevators)
    );
    listOfElevators[elvId][0] = floor;
    this.setState({ queueOfElevators: listOfElevators });
  };

  /**
   * adjusting the time when the elevator is waits two seconds
   * @param elevatorId
   */
  private adjustingElevatorTwoSecondWait = (elevatorId: number): void => {
    const iteration = 3;
    let copyList: number[] = this.state.adjustingElevatorWait;
    for (let i = 0; i < iteration; i++) {
      setTimeout(() => {
        copyList[elevatorId] += 1 / 2;
        this.setState({ adjustingElevatorWait: copyList });
      }, 500);
    }
  };

  private playAudio = (): void => {
    let audio: HTMLAudioElement = this.state.audio;
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  };

  render(): JSX.Element {
    return (
      <Styles.Container>
        <Styles.Building>{this.renderFloors()}</Styles.Building>
        <Styles.ElevatorsWrapper>
          {this.renderElevator()}
        </Styles.ElevatorsWrapper>
      </Styles.Container>
    );
  }
}

export default BuildingCreator;
