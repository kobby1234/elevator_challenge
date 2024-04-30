import * as Styles from "./floor.ts";
import React from "react";

interface ICounterProps {
    isFloor: boolean
    floorNumber: number
    floorId: number
    isColor: boolean
    isId: number
    timer: number
    
    orderElevator: (floor: number ) => void
    
}
interface State {
    isColor: boolean
    floorId: number
    currentTimer: number
    intervalId : NodeJS.Timer | undefined
}

class Floor extends React.Component<ICounterProps, State> {
    // public static defaultProps = {
    //     label: 'isFloor'
    // };

  constructor(props: ICounterProps) {
    super(props);
      this.state = {
        isColor: false,
        floorId: this.props.floorId,
        currentTimer: 0,
        intervalId: undefined,

      };
      console.log(this.props.isFloor)
    // this.shouldComponentUpdate
  }
//   componentDidUpdate(): void {
//     console.log("$$$$$$$$$$$$$4",this.state.isColor,this.props.isColor
//         ,this.state.floorId,this.props.floorId
//     )
//     if(this.state.isColor !== this.props.isColor && this.state.floorId === this.props.isId){
//         this.setState({isColor: this.props.isColor, currentTimer: this.props.timer})
//         this.countingDown()
//       }
//   }
componentDidUpdate(prevProps: ICounterProps): void {

    // Check if isColor and floorId have changed and the countdown isn't already running
    if (this.state.isColor !== this.props.isColor && this.state.floorId === this.props.isId
    ) {
        console.log("hahahahahhahahah")
            this.setState({ isColor: this.props.isColor})
                if(this.props.isColor){
               this.activeModifyCurrentElevator();
                }
                
                
            }
            // this.setState({currentTimer: 0})

            console.log("Timer",this.state.currentTimer)
}
activeModifyCurrentElevator =  () => {
    const delayBetweenActivations: number = 1000;
    let activationsLeft: number = this.props.timer;

    const activateWithDelay = () => {
        if (activationsLeft > 0) {
            this.setState({ currentTimer: activationsLeft });
            activationsLeft--;

            setTimeout(activateWithDelay, delayBetweenActivations);
        }
        else{
            this.setState({currentTimer: 0})
        }
    };

   activateWithDelay(); // Start the first activation

    // Set the timer to 0 after all activations are done
    
        // this.setState({ currentTimer: 0 });
}

// componentWillUnmount() {
//     // Clear the interval when the component is unmounted to avoid memory leaks
//     if (this.state.intervalId) {
//         clearInterval(this.state.intervalId);
//     }
// }

// countingDown = (): void => {
//     if (this.state.intervalId) return; // Prevent multiple intervals

//     const interval = setInterval(this.isInterval, 1000);
//     this.setState({ intervalId: interval });
// };

// isInterval = (): void => {
//     this.setState((prevState) => ({
//         currentTimer: prevState.currentTimer - 1,
//     }), () => {
//         if (this.state.currentTimer === 0) {
//             clearInterval(this.state.intervalId);
//             // Optionally, you can reset the timer when it reaches 0
//             // this.setState({ currentTimer: this.props.timer });
//         }
//     });
// };
// activeModifyCurrentElevator = () => {
    
//         const delayBetweenActivations:number = 1000;
//         let activationsLeft:number = this.props.timer;
//         const activateWithDelay = () => {
//             console.log("let activationsLeft:number = this.props.timer;",activationsLeft)
//             if (activationsLeft > 0) {
//             // Call your function here
//             activationsLeft --;
//             this.setState({currentTimer: activationsLeft})
            
    
//             setTimeout(activateWithDelay, delayBetweenActivations);
//             }else{
//             console.log("###################################3")
//             this.setState({currentTimer: 0})
//             }
//         };
    
//         setTimeout(activateWithDelay, delayBetweenActivations);
// }
//   countingDown =():void =>{
//     // if (this.state.intervalId) return;

//     const interval = setInterval(this.isInterval,1000)
//     this.setState({intervalId: interval})
//   }
//   isInterval =(): void =>{
//     if (this.state.currentTimer > 0) {
        
//         this.setState((prevState) => ({
//             currentTimer: prevState.currentTimer - 1,
//         }));
//     } else {
        
//         clearInterval(this.state.intervalId);
//         // this.setState({intervalId: undefined})
//     }
// };
// countingDown = (): void => {
//     const intervalId = setInterval(() => {
//         this.setState(prevState => ({
//             currentTimer: prevState.currentTimer - 1
//         }), () => {
//             if (this.state.currentTimer === 0) {
//                 clearInterval(intervalId);
//             }
//         });
//     }, 1000);
// };





  
  render() {
    return <>
        {!this.props.isFloor ?(
            <Styles.FloorWrapper>
            <Styles.Floor>
                <Styles.CallControl isColor ={this.state.isColor} onClick={() => this.props.orderElevator(this.props.floorNumber)}> {this.props.floorNumber}</Styles.CallControl>
            </Styles.Floor>
            {Boolean(this.state.currentTimer) ? (
                    <Styles.Timer > {this.state.currentTimer}</Styles.Timer>
                ):(<></>
            )}
            </Styles.FloorWrapper>)
        :(
            <>
            <Styles.TopOfTheFloor>
            </Styles.TopOfTheFloor>
            <Styles.FloorWrapper>
            <Styles.Floor>
                <Styles.CallControl isColor ={this.state.isColor} onClick={() => this.props.orderElevator(this.props.floorNumber)}> {this.props.floorNumber}</Styles.CallControl>
            </Styles.Floor>
            {Boolean(this.state.currentTimer) ? (
                <Styles.Timer > {this.state.currentTimer}</Styles.Timer>
            ):(<></>)}
                </Styles.FloorWrapper>
            </>
        )} 
     </>

    
    }

}

export default Floor;
