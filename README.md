## Elevator project architecture
the project consist of four main classes 
Floor , Elevator , Building and BuildingFactory
- Building: the Building creates the floors and Elevators
-for the Elevator the Building holds 3 states 
 first is list of numbers for creating the Elevators
 ,second is the elevator_id ,
 third is floor: to tell the elevator where to go
 , and also send a function to manage the queue of the elevator
-for the Floor the building holds 4 states 
 first is list of numbers for creating the Floors
 ,second is floor_id ,
 third is a boolean variable for the color of the number of a floor
 ,fourth is variable for the timer, and also send a function to order an elevator
- BuildingFactory creates the buildings and telling them how many floors and elevators
  to create
## Main algorithm
the algorithm consist of two main function.
the first one is adding the floor to queue of elevator that has the shortest time to reach the floor
and if the floor does not travel it send the elevator directly to the floor,

the second function is manage the queue of the elevator by updating the current location of the elevator
and when the floor reach the destination floor, it check if there is floors that waiting for the elevator
and send the elevator to the next floor 

## Available Scripts

In the project directory, run:
### `npm i` 

### `npm start`


