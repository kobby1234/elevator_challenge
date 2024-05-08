import React from "react";
import ConcreteCreator1 from "./floor.tsx";
import * as Styles from "./building.ts";
import ElevatorCreator from "./elevator.tsx";
import { Dict } from "styled-components/dist/types";

class BuildingCreator extends React.Component<BuildingProps> {
  render() {
    return (
      <>
        <Building
          numberOfFloors={this.props.numberOfFloors}
          numberOfElevators={this.props.numberOfElevators}
        />
      </>
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
  floors: Dict[];
  floorColor: boolean;
  floorId: number;
  floorTimer: number;
  audio: HTMLAudioElement;
}

class Building extends React.Component<BuildingProps, BuildingState> {
  constructor(props: BuildingProps) {
    super(props);
    const floorList: Dict[] = this.createListOfFloors();
    this.state = {
      floors: floorList,
      elevators: Array.from(
        { length: this.props.numberOfElevators },
        (_, index) => index
      ),
      queueOfElevators: Array.from(
        { length: this.props.numberOfElevators },
        () => [0]
      ),
      orderedFloor: 0,
      elevatorId: 0,
      floorColor: false,
      floorId: -1,
      floorTimer: 0,
      audio: new Audio("./ding.mp3"),
    };
  }
  
  private createListOfFloors = (): Dict[] => {
    const floors = this.props.numberOfFloors;
    const initialFloorNumber: boolean[] = Array.from(
      { length: floors },
      (_, index) => !(index === 0 || index === floors)
    );
    const initialNumber = Array.from(
      { length: floors },
      (_, index) => floors - index - 1
    );
    const floorList: Dict[] = initialNumber.map((key, index) => ({
      [key]: initialFloorNumber[index],
    }));

    return floorList;
  };

  renderFloors = (): JSX.Element[] => {
    return this.state.floors.map((floor, index) => (
      <ConcreteCreator1
        key={index}
        floorId={Number(Object.keys(floor)[0])}
        isId={this.state.floorId}
        isColor={this.state.floorColor}
        isFloor={floor[Object.keys(floor)[0]]}
        floorNumber={Number(Object.keys(floor)[0])}
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
      setTimeout(() => {
        this.setState({ floorColor: false, floorId: floor });
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
    copyList.map((elv, index) => {
      isMinimum = 0;
      elv.push(floor);

      for (let index = 0; index < elv.length - 1; index++) {
        isMinimum += (Math.abs(elv[index] - elv[index + 1]) * 1) / 2;
      }
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
