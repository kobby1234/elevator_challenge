import React from "react";
import * as Styles from "./building_factory.style.ts";
import BuildingCreator from "./building.tsx";
import buildingsData from "./buildingSetting.json";

class BuildingsFactoryCreator extends React.Component {
  render(): JSX.Element {
    return <BuildingsFactory />;
  }
}

interface Building {
  floors: number;
  elevators: number;
}

interface State {
  listOfBuilding: Building[];
}

class BuildingsFactory extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      listOfBuilding: buildingsData,
    };
  }

  componentDidMount() {
    // Scroll window down when the component mounts
    window.scrollTo(0, document.body.scrollHeight);
  }

  public renderBuildings = (): JSX.Element[] => {
    return this.state.listOfBuilding.map((building, index) => (
      <BuildingCreator
        key={index}
        numberOfElevators={building.elevators}
        numberOfFloors={building.floors}
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
