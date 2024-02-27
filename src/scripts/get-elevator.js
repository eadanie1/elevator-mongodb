
import { Elevator } from "../../app.js";

export async function statusAllElevators(req, res) {
  try {
      const elevators = await Elevator
        .find({id: {$gte: 1, $lte: 3}})
        .select('id currentFloor status destinationFloor -_id')
        .sort('id')
      return elevators;
  }
  catch(error) {
    console.error('Error retrieving collection', error)
  }
}

export async function isElevatorAvailable(id, req, res) {
  try {
      const elevator = await Elevator
        .find({id: id})
        .select('id currentFloor status -_id')
      res.json(elevator);
      elevator[0].status === 'idle' ? console.log(`Elevator ${id} is available for a new call`) : 
        console.log(`Elevator ${id} is busy, please wait for the next idle elevator`);
  }
  catch(error) {
    console.error('Error', error)
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
    path: '/api/elevators/get-status/:id',
    handler: async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await isElevatorAvailable(id, req, res);
      }
      catch(error) {
        console.error('Error', error.message);
      }
    }
  }
];

export default { statusAllElevators, isElevatorAvailable, getRoutes };