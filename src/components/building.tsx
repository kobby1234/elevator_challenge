import React from "react";
import ConcreteCreator1 from "./floor.tsx";
import * as Styles from "./building.ts";
import ElevatorCreator from "./elevator.tsx";
import { Dict } from "styled-components/dist/types";
// const soundFilePath: string = "./ding.mp3"
// const audio = new Audio("./ding.mp3");

interface PropsCreator {
  numberOfFloors: number;
  numberOfElevators: number;
}
class BuildingCreator extends React.Component<PropsCreator> {
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
interface Props {
  numberOfFloors: number;
  numberOfElevators: number;
}
interface State {
  numbers: Dict[];
  numberOfElevator: number[];
  listOfElevators: number[][];
  orderedFloor: number;
  elevatorId: number;
  floorColor: boolean;
  floorId: number;
  floorTimer: number;
  audio: HTMLAudioElement;
}

class Building extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const floorList: Dict[] = this.createListOfFloors();
    this.state = {
      numbers: floorList,
      numberOfElevator: Array.from(
        { length: this.props.numberOfElevators },
        (_, index) => index
      ),
      listOfElevators: Array.from(
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
    // const elevators = this.props.numberOfElevators;
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

  renderFloors = () => {
    return this.state.numbers.map((floor, index) => (
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
  renderElevator = () => {
    return this.state.numberOfElevator.map((index) => (
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
    // if elevator arrived to the floor
    if (floor === this.state.listOfElevators[elvId][1]) {
      this.playAudio();
      setTimeout(() => {
        this.setState({ floorColor: false, floorId: floor });
        this.removeFloorFromQueue(elvId);
        // if there is  a floor waiting
        if (this.state.listOfElevators[elvId].length > 2) {
          this.sendElevator(elvId, this.state.listOfElevators[elvId][2]);
        }
      }, 2000);
    } else {
      this.updateElevatorPosition(elvId, floor);
    }
  };

  private manageElevatorOrder = (floor: number): number => {
    const [elevatorId, speed]: number[] = this.chooseElevator(floor);
    this.addFloorToQueue(floor, elevatorId);
    if (this.state.listOfElevators[elevatorId].length < 2) {
      this.sendElevator(elevatorId, floor);
    }
    return speed;
  };

  private isFloorOrdered = (floor: number): boolean => {
    let listOfElevators: number[][] = JSON.parse(
      JSON.stringify(this.state.listOfElevators)
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
      JSON.stringify(this.state.listOfElevators)
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
      JSON.stringify(this.state.listOfElevators)
    );
    listOfElevators[elevatorIndex].push(floor);
    this.setState({
      listOfElevators: listOfElevators,
    });
  };
  private removeFloorFromQueue = (elevatorIndex: number): void => {
    const listOfElevators: number[][] = JSON.parse(
      JSON.stringify(this.state.listOfElevators)
    );
    listOfElevators[elevatorIndex].shift();
    this.setState({ listOfElevators: listOfElevators });
  };

  sendElevator = (elevatorIndex: number, floor: number): void => {
    this.setState({ elevatorId: elevatorIndex, orderedFloor: floor });
  };

  private updateElevatorPosition = (elvId: number, floor: number): void => {
    const listOfElevators: number[][] = JSON.parse(
      JSON.stringify(this.state.listOfElevators)
    );
    listOfElevators[elvId][0] = floor;
    this.setState({ listOfElevators: listOfElevators });
  };
  private playAudio = (): void => {
    this.state.audio.pause();
    this.state.audio.currentTime = 0;
    this.state.audio.play();
  };

  render() {
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
