import * as Styles from "./floor.ts";
import React from "react";
import { Dict } from "styled-components/dist/types";

// abstract class Creator {
//     public abstract factoryMethod(props: ICounterProps): Product;

//     public someOperation(props: ICounterProps): JSX.Element {
//         const product = this.factoryMethod(props);
//         return product.render();
//     }
// }


interface PropsCreator {
    isFloor: boolean
    floorNumber: number
    floorId: number
    isColor: boolean
    isId: number
    timer: number
    orderElevator: (floor: number ) => void
    
}

class ConcreteCreator1 extends  React.Component<PropsCreator>  {
   
    render() {
        return<>
        <Floor 
         floorId={this.props.floorNumber}
         isId = {this.props.isId}
         isColor = {this.props.isColor}
         isFloor={this.props.isFloor}
         floorNumber={this.props.floorNumber}
         orderElevator={this.props.orderElevator}
         timer={this.props.timer} 
            />
        </>
    }
}

// interface Product {
//     render(): JSX.Element;

    
// }

interface PropsFloor {
    isFloor: boolean
    floorNumber: number
    floorId: number
    isColor: boolean
    isId: number
    timer: number
    orderElevator: (floor: number ) => void
}
interface State  {
    isColor: boolean
    floorId: number
    currentTimer: number
    intervalId : NodeJS.Timer | undefined
}

class Floor extends React.Component<PropsFloor, State>  {
 

  constructor(props: PropsFloor) {
    super(props);
      this.state = {
        isColor: false,
        floorId:  props.floorId,
        currentTimer: 0,
        intervalId: undefined,

      };
      console.log(this.props.isFloor)
  }

componentDidUpdate(): void {
    console.log(this.state.isColor , this.props.isColor,"if (this.state.isColor !== this.props.isColor && this.state.floorId === this.props.isId")
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

export default ConcreteCreator1;
