
import { elevators } from "../../app.js";


export async function updateElevatorStatus(req, res) {
  const elevator = elevators.find(e => e.id === parseInt(req.params.id));
  
  if (!elevator) {
    return res.status(404).json({error: 'No elevator found with that ID'});
  }
  
  if (elevator.currentFloor === req.body.destinationFloor) {
    return res.json({ message: 'Elevator already at that floor' });
  }
  
  elevator.destinationFloor = req.body.destinationFloor;
  
  const direction = (elevator.currentFloor < req.body.destinationFloor ? 'moving_up' : 'moving_down'); 
  elevator.status = direction;
  
  setTimeout(() => {
    elevator.status = 'idle';
    elevator.currentFloor = req.body.destinationFloor;
    elevator.destinationFloor = 0;
    return res.json({ message: `Elevator no ${elevator.id} has arrived at floor ${elevator.currentFloor}`});
  }, 2000);
}


export const putRoutes = [
  {
    path: '/api/elevators/set-floor/:id',
    handler: async (req, res) => {
      try {
        await updateElevatorStatus(req, res);
      }
      catch(error) {
        console.error('Error', error.message);
      }
    }
  }
];


export default { putRoutes };