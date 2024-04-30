import React from "react";
import * as Styles from "./building_factory.ts";
import Building from "./building.tsx";

abstract class Creator {
   
    public abstract factoryMethod(): Product;

   
    public someOperation():  JSX.Element {
        const product = this.factoryMethod();
        return product.render();
    }
}


class ConcreteCreator1 extends Creator {
    
    public factoryMethod(): Product {
        return new BuildingFactory({});
    }
}

interface Product {
    render(): JSX.Element;
    
}


type State  = {
    listOfBuilding: number[][]
}

class BuildingFactory extends React.Component<{},State> implements Product{
  

  constructor(props: any) {
    super(props);
      this.state = {
        listOfBuilding:[[10,3],[9,3]],

      };
      
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

export default ConcreteCreator1;
