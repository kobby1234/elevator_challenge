import * as Styles from "./floor.style.ts";
import React from "react";

interface PropsCreator {
  floorNumber: number;
  isColor: boolean;
  isId: number;
  timer: number;
  orderElevator: (floor: number) => void;
}

class FloorCreator extends React.Component<PropsCreator> {
  render(): JSX.Element {
    return (
        <Floor
          floorId={this.props.floorNumber}
          isId={this.props.isId}
          isColor={this.props.isColor}
          floorNumber={this.props.floorNumber}
          orderElevator={this.props.orderElevator}
          timer={this.props.timer}
        />
    );
  }
}

interface PropsFloor {
  floorNumber: number;
  floorId: number;
  isColor: boolean;
  isId: number;
  timer: number;
  orderElevator: (floor: number) => void;
}
interface State {
  isColor: boolean;
  floorId: number;
  currentTimer: number;
}

class Floor extends React.Component<PropsFloor, State> {
  constructor(props: PropsFloor) {
    super(props);
    this.state = {
      isColor: false,
      floorId: props.floorId,
      currentTimer: 0,
    };
  }

  componentDidUpdate(): void {
    if (
      this.state.isColor !== this.props.isColor &&
      this.state.floorId === this.props.isId
    ) {
      this.setState({ isColor: this.props.isColor });
      if (this.props.isColor) {
        this.modifyTimer();
      }
    }
  }

  private modifyTimer = (): void => {
    let delay: number = 1000;
    let timerLeft: number = this.props.timer;
    const timerWithDelay = () => {
      if (timerLeft > 0) {
        this.setState({ currentTimer: timerLeft });
        if (timerLeft === 1 / 2) {
          delay = 500;
        }
        timerLeft--;
        setTimeout(timerWithDelay, delay);
      } else {
        this.setState({ currentTimer: 0 });
      }
    };

    timerWithDelay();
  };

  render() {
    return (
      <Styles.FloorWrapper>
        <Styles.Floor>
          <Styles.FloorButton
            isColor={this.state.isColor}
            onClick={() => this.props.orderElevator(this.props.floorNumber)}
          >
            {this.props.floorNumber}
          </Styles.FloorButton>
        </Styles.Floor>

        <Styles.Timer>
          {Boolean(this.state.currentTimer) && this.state.currentTimer}
        </Styles.Timer>
      </Styles.FloorWrapper>
    );
  }
}

export default FloorCreator;
