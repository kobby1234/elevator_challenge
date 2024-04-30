import React  from "react";
import * as Styles from "./alevator.ts";
import elvImage from "../images/elv.png";

// interface ICounterProps {
//     top?: number

// }
interface State {
  top: number;
  floorNumber: number;
  currentFloor: number;
//   listOfOrderedFloors: number[];
  elevatorId: number;
  speed: number;
  distance: number;
  prevFloor: number
  isDirection: boolean
  
}
interface IProps {
  floorNumber: number;
  elevatorId: number;
  isId: number;
//   handelRemovingFloor: (id: number) => void;
  modifyCurrentElevator: (floor: number, elvId:number) => void; 
}

class Elevator extends React.Component<IProps, State> {
  //     // public static defaultProps = {
  //     //     label: 'isFloor'
  //     // };

  constructor(props: any) {
    super(props);
    this.state = {
      top: 10,
      floorNumber: 0,
    //   listOfOrderedFloors: [0],
      currentFloor: 0,
      elevatorId: this.props.elevatorId,
      speed: 1,
      distance: 0,
      isDirection: true,
      prevFloor: 0,
    };
  }

    componentDidUpdate(prevProps: IProps, prevState: State) {
        // Check if the floorNumber prop has changed
        // console.log("console.log(",this.props.floorNumber,prevProps.floorNumber,"##",this.state.elevatorId,this.props.isId)
        if (
            this.props.floorNumber !== prevProps.floorNumber &&
            this.state.elevatorId === this.props.isId
            ) {
            this.handleClick();
            }
    
        // Check if distance has changed
        // console.log("if (this.state.distance !== prevState.distance && this.state.elevatorId === this.props.isId)",
        // this.state.distance,"!==",prevState.distance,"##",this.state.elevatorId,"===",this.props.isId)
        // if (this.state.distance !== prevState.distance && this.state.elevatorId === this.props.isId) {
        //     const numberOfActivations:number = this.state.distance;
        //     const delayBetweenActivations:number = 500;
        //     let activationsLeft:number = numberOfActivations;
        //     let currentFloor:number = this.state.prevFloor
        //     const activateWithDelay = () => {
        //         if (activationsLeft > 0) {
        //         // Call your function here
        //         if(this.state.isDirection){
        //             currentFloor++
        //         }
        //         else{
        //             currentFloor--
        //         }
        //         console.log("currentFloor",currentFloor)
        //         this.props.modifyCurrentElevator(currentFloor, this.state.elevatorId);
        
        //         activationsLeft--;
        //         setTimeout(activateWithDelay, delayBetweenActivations);
        //         }
        //     };
        
        //     setTimeout(activateWithDelay, delayBetweenActivations);
        //     }
    }
  
    activeModifyCurrentElevator = (distance: number) => {
        const numberOfActivations:number = distance;
            const delayBetweenActivations:number = 500;
            let activationsLeft:number = numberOfActivations;
            let currentFloor:number = this.state.currentFloor
            console.log("numberOfActivations",activationsLeft,this.state.currentFloor)
            const activateWithDelay = () => {
                if (activationsLeft > 0) {
                // Call your function here
                if(this.state.isDirection){
                    currentFloor++
                }
                else{
                    currentFloor--
                }
                console.log("currentFloor",currentFloor,this.state.prevFloor)
                this.props.modifyCurrentElevator(currentFloor, this.state.elevatorId);
        
                activationsLeft--;
                setTimeout(activateWithDelay, delayBetweenActivations);
                }
            };
        
            setTimeout(activateWithDelay, delayBetweenActivations);
    }

    handleClick = () => {
        const prevTop = this.state.top;
        const num1 = this.state.currentFloor
        const num2 = this.props.floorNumber;
        console.log("handleClick called with floorNumber:", this.props.floorNumber);
        let newTop = prevTop;
        let distance:number = 0
        this.setState({prevFloor: num1})
        if (num1 !== undefined && num2 !== undefined) {
            distance = Math.abs(num1 - num2);
            this.setState({speed: distance * 500})
            if (num1 < num2) {
                this.setState({isDirection: true})
                newTop -= distance * 110;
            } else {
                newTop += distance * 110;
                this.setState({isDirection: false})

            }
        }

    
    this.setState({
        top: newTop,
        currentFloor: this.props.floorNumber, // Remove the first element
        distance: distance
    });
    this.activeModifyCurrentElevator(distance)
    console.log("speed of id",this.state.elevatorId,"  ",this.state.speed)
    // setTimeout(() => {
    //     this.props.handelRemovingFloor(this.state.elevatorId);
    // }, distance * 500 + 2000);
    
};


  render() {
    return (
      <Styles.Elevator
        src={elvImage}
        alt=""
        $top={this.state.top}
        speed={this.state.speed}
      ></Styles.Elevator>
    );
  }
}

export default Elevator;
