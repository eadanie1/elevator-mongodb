
import { elevators } from "../../app.js";


export async function statusAllElevators(req, res) {
  return elevators;
}

export async function getElevatorStatus(elevators, req, res) {
  const locationAndStatusAll = await elevators.map(elevator => ({
    id: elevator.id,
    currentFloor: elevator.currentFloor,
    status: elevator.status
  }));
  res.json(locationAndStatusAll);    
}

export async function isElevatorAvailable(elevators, req, res) {
  const elevator = await elevators.find(e => e.id === parseInt(req.params.id));
  if (elevator.status === 'idle') {
        return res.json({message: `Elevator ${elevator.id} is idle and available for a new call`});
    } else {
          return res.json({message: `Elevator ${elevator.id} is busy and unavailable to take a new call`});
    }
}


export const getRoutes = [
  {
    path: '/api/elevators',
    handler: async (req, res) => {
      const elevatorsList = await statusAllElevators(req, res);
      res.json(elevatorsList);
    }
  },
  {
    path: '/api/elevators/get-elevator-status',
    handler: async (req, res) => {
      try {
        await getElevatorStatus(elevators, req, res);
      }
      catch(error) {
        console.error('Error', error.message);
      }
    }
  },
  {
    path: '/api/elevators/availability/:id',
    handler: async (req, res) => {
      try {
        await isElevatorAvailable(elevators, req, res);
      }
      catch(error) {
        console.error('Error', error.message);
      }
    }
  }
];
              
              
export default { statusAllElevators, getElevatorStatus, isElevatorAvailable, getRoutes };