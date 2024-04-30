import React from "react";
import * as Styles from "./building_factory.ts";
import Building from "./building.tsx";

interface State {
    listOfBuilding: number[][]
}

class BuildingFactory extends React.Component<{},State> {
    // public static defaultProps = {
    //     label: 'isFloor'
    // };

  constructor(props: any) {
    super(props);
      this.state = {
        listOfBuilding:[[10,3],[9,3]],

      };
      
    // this.shouldComponentUpdate
}
renderBuildings = () =>{
    return this.state.listOfBuilding.map((building, index) => (
        <Building
            key={index}
            numberOfElevators={building[1]}
            numberOfFloors={building[0]}
            
        />
            
    
    ));
}
  
  
  render() {
    return <>
    <Styles.Container>
        {this.renderBuildings()}
        </Styles.Container>
     </>

    
    }

}

export default BuildingFactory;
