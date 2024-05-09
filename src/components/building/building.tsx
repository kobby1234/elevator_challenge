import React from "react";
import FloorCreator from "../floor/floor.tsx";
import * as Styles from "./building.style.ts";
import ElevatorCreator from "../elevator/elevator.tsx";
import { Dict } from "styled-components/dist/types";

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
    this.state = {
      floors: Array.from(
        { length: this.props.numberOfFloors },
        (_, index) => index
      ),
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
        floorNumber={Number(floor)}
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
        modifyCurrentElevator={this.manageElevatorQueue}
      />
    ));
  };

  public orderElevator = (floor: number): void => {
    const isFloorAlreadyOrdered: boolean = this.isFloorOrdered(floor);
    if (!isFloorAlreadyOrdered) {
      let seconds = this.manageElevatorOrder(floor);
      this.setState({ floorColor: true, floorId: floor, floorTimer: seconds });
    }
  };

  public manageElevatorQueue = (floor: number, elvId: number) => {
    // if elevator arrived at the floor
    if (floor === this.state.queueOfElevators[elvId][1]) {
      this.playAudio();
      this.adjustingElevatorDistance(elvId);
      setTimeout(() => {
        let copyList: number[] = this.state.adjustingElevatorWait;
        copyList[elvId] = 0;

        this.setState({
          floorColor: false,
          floorId: floor,
          adjustingElevatorWait: copyList,
        });
        this.removeFloorFromQueue(elvId);
        // if there is a floor waiting in the queue
        if (this.state.queueOfElevators[elvId].length > 2) {
          this.sendElevator(elvId, this.state.queueOfElevators[elvId][2]);
        }
      }, 2000);
    } else {
      this.updateElevatorPosition(elvId, floor);
    }
  };

  private manageElevatorOrder = (floor: number): number => {
    const [elevatorId, speed]: number[] = this.chooseElevator(floor);
    this.addFloorToQueue(floor, elevatorId);
    // if there is no other floors waiting
    if (this.state.queueOfElevators[elevatorId].length < 2) {
      this.sendElevator(elevatorId, floor);
    }
    return speed;
  };

  private isFloorOrdered = (floor: number): boolean => {
    let listOfElevators: number[][] = JSON.parse(
      JSON.stringify(this.state.queueOfElevators)
    );
    let isFloorAlreadyOrdered: boolean = false;
    for (var index = 0; index < listOfElevators.length; index++) {
      if (listOfElevators[index].length > 1) {
        listOfElevators[index].shift();
      }
      if (listOfElevators[index].includes(floor)) {
        isFloorAlreadyOrdered = true;
        break;
      }
    }
    return isFloorAlreadyOrdered;
  };

  private chooseElevator = (floor: number): number[] => {
    let minimum: number = 1000;
    let elevatorIndex: number = -1;
    let copyList: number[][] = JSON.parse(
      JSON.stringify(this.state.queueOfElevators)
    );
    let isMinimum: number = 0;
    copyList.forEach((elv, index) => {
      isMinimum = 0;
      elv.push(floor);

      for (let i = 0; i < elv.length - 1; i++) {
        isMinimum += (Math.abs(elv[i] - elv[i + 1]) * 1) / 2;
      }
      isMinimum -= this.state.adjustingElevatorWait[index];
      if (elv.length > 2) {
        isMinimum += (elv.length - 2) * 2;
      }
      if (isMinimum < minimum) {
        minimum = isMinimum;
        elevatorIndex = index;
      }
    });

    return [elevatorIndex, minimum];
  };

  private addFloorToQueue = (floor: number, elevatorIndex: number): void => {
    const listOfElevators: number[][] = JSON.parse(
      JSON.stringify(this.state.queueOfElevators)
    );
    listOfElevators[elevatorIndex].push(floor);
    this.setState({
      queueOfElevators: listOfElevators,
    });
  };

  private removeFloorFromQueue = (elevatorIndex: number): void => {
    const listOfElevators: number[][] = JSON.parse(
      JSON.stringify(this.state.queueOfElevators)
    );
    listOfElevators[elevatorIndex].shift();
    this.setState({ queueOfElevators: listOfElevators });
  };

  sendElevator = (elevatorIndex: number, floor: number): void => {
    this.setState({ elevatorId: elevatorIndex, orderedFloor: floor });
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

  private adjustingElevatorDistance = (elevatorId: number): void => {
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
