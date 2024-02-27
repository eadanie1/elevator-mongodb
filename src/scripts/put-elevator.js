
import { Elevator } from "../../app.js";
import asyncLock from 'async-lock'; // Import async-lock package
const lock = new asyncLock(); // Create a new instance of async-lock

export async function updateElevatorStatus(id, destinationFloor, req, res) {
  try {
    await lock.acquire('updateElevatorLock', async () => {
    const elevator = await Elevator
      .findOne({id: id});
      if (!elevator) {
        console.log('No elevator found, please double check the ID no and try again')
        return;
      };
  
      if (elevator.currentFloor === destinationFloor) {
        console.log('Elevator already at that floor')
        return;
      };
  
      elevator.set({
        status: elevator.currentFloor < destinationFloor ? 'moving_up' : 'moving_down',
        destinationFloor: destinationFloor
      });
  
      const tempUpdatedElevator = await elevator.save();
      console.log(`Elevator ${id} is called for floor ${destinationFloor}`);
  
      const moveTime = Math.abs(destinationFloor - elevator.currentFloor) * 1000;
      await new Promise(resolve => setTimeout(resolve, moveTime));
  
      elevator.set({
        currentFloor: destinationFloor,
        status: 'idle',
        destinationFloor: 0
      });
      
      const updatedElevator = await elevator.save();
      console.log(`Elevator ${id} has reached floor ${destinationFloor}`);
      res.json(`Elevator ${id} has reached floor ${destinationFloor}`);
    });}
  catch(error) {
    console.error('Could not perform task', error)
  }
}

export const putRoutes = [
  {
    path: '/api/elevators/set-floor/:id/:floor',
    handler: async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const destinationFloor = parseInt(req.params.floor);
        await updateElevatorStatus(id, destinationFloor, req, res);
      }
      catch(error) {
        console.error('Error', error.message);
      }
    }
  }
];

export default { putRoutes };