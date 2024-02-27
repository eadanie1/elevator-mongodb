import express from 'express';
import { getRoutes } from './src/scripts/get-elevator.js';
import { putRoutes } from './src/scripts/put-elevator.js';
import { callElevatorAPI, callElevatorRouteHandler } from './src/scripts/post-elevator.js';
const app = express();
app.use(express.json());

export const elevators = [
  {id: 1,
  currentFloor: 0,
  status: 'idle',
  destinationFloor: 0
  },
  {id: 2,
  currentFloor: 0,
  status: 'idle',
  destinationFloor: 0
  },
  {id: 3,
  currentFloor: 0,
  status: 'idle',
  destinationFloor: 0
  }
];

getRoutes.forEach(route => {
  app.get(route.path, route.handler);
});

putRoutes.forEach(route => {
  app.put(route.path, route.handler);
});

app.post('/api/elevators/call', callElevatorRouteHandler);
callElevatorAPI([10, 15, 20, 22, 23, 24]);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

export default { elevators };