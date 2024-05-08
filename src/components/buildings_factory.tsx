import React from "react";
import * as Styles from "./building_factory.ts";
import BuildingCreator from "./building.tsx";

class BuildingsFactoryCreator extends React.Component {
  render(): JSX.Element {
    return <BuildingsFactory />;
  }
}

type State = {
  listOfBuilding: number[][];
};

class BuildingsFactory extends React.Component<{}, State> {
  constructor(props: any) {
    const floor: number = 1;
    const elevator: number = 1;
    super(props);
    this.state = {
      listOfBuilding: [
        [floor * 10, elevator * 3],
        [floor * 6, elevator * 4],
        // [floor * 10, elevator * 4],
      ],
    };
  }

  public renderBuildings = (): JSX.Element[] => {
    return this.state.listOfBuilding.map((building, index) => (
      <BuildingCreator
        key={index}
        numberOfElevators={building[1]}
        numberOfFloors={building[0]}
      />
    ));
  };

  render(): JSX.Element {
    return (
      <>
        <Styles.Container>{this.renderBuildings()}</Styles.Container>
      </>
    );
  }
}

export default BuildingsFactoryCreator;
