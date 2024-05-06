import * as Styles from "./floor.ts";
import React from "react";

interface PropsCreator {
  isFloor: boolean;
  floorNumber: number;
  floorId: number;
  isColor: boolean;
  isId: number;
  timer: number;
  orderElevator: (floor: number) => void;
}

class ConcreteCreator1 extends React.Component<PropsCreator> {
  render() {
    return (
      <>
        <Floor
          floorId={this.props.floorNumber}
          isId={this.props.isId}
          isColor={this.props.isColor}
          isFloor={this.props.isFloor}
          floorNumber={this.props.floorNumber}
          orderElevator={this.props.orderElevator}
          timer={this.props.timer}
        />
      </>
    );
  }
}
interface PropsFloor {
  isFloor: boolean;
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
    // console.log(this.props.isFloor);
  }

  componentDidUpdate(): void {
    // console.log(this.state.isColor , this.props.isColor,"if (this.state.isColor !== this.props.isColor && this.state.floorId === this.props.isId")
    if (
      this.state.isColor !== this.props.isColor &&
      this.state.floorId === this.props.isId
    ) {
      this.setState({ isColor: this.props.isColor });
      if (this.props.isColor) {
        this.modifyTimer();
      }
    }
    // console.log("Timer",this.state.currentTimer)
  }

   private modifyTimer = () :void =>  {
    let delay: number = 1000;
    let timerLeft: number = this.props.timer;
    // recursive function with half a second of delay
    const timerWithDelay = () => {
      if (timerLeft > 0) {
        this.setState({ currentTimer: timerLeft });
        if(timerLeft === 1/2){delay =  500}
        timerLeft --;
        setTimeout(timerWithDelay, delay);

      }
      else {
        this.setState({ currentTimer: 0 });
      }
    };

    timerWithDelay(); // Start the first activation

    // Set the timer to 0 after all activations are done
  };

  render() {
    return (
      <>
        {!this.props.isFloor ? (
          <Styles.FloorWrapper>
            <Styles.Floor>
              <Styles.FloorButton
                isColor={this.state.isColor}
                onClick={() => this.props.orderElevator(this.props.floorNumber)}
              >
                {this.props.floorNumber}
              </Styles.FloorButton>
            </Styles.Floor>
            {Boolean(this.state.currentTimer) ? (
              <Styles.Timer> {this.state.currentTimer}</Styles.Timer>
            ) : (
              <></>
            )}
          </Styles.FloorWrapper>
        ) : (
          <>
            <Styles.TopOfTheFloor></Styles.TopOfTheFloor>
            <Styles.FloorWrapper>
              <Styles.Floor>
                <Styles.FloorButton
                  isColor={this.state.isColor}
                  onClick={() =>
                    this.props.orderElevator(this.props.floorNumber)
                  }
                >
                  {this.props.floorNumber}
                </Styles.FloorButton>
              </Styles.Floor>
              {Boolean(this.state.currentTimer) ? (
                <Styles.Timer> {this.state.currentTimer}</Styles.Timer>
              ) : (
                <></>
              )}
            </Styles.FloorWrapper>
          </>
        )}
      </>
    );
  }
}

export default ConcreteCreator1;
