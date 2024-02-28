import express from 'express';
import mongoose, { mongo } from 'mongoose';
import { getRoutes } from './src/scripts/get-elevator.js';
import { putRoutes } from './src/scripts/put-elevator.js';
import { callElevatorAPI, callElevatorRouteHandler } from './src/scripts/post-elevator.js';
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost/elevators')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Unable to connect to MongoDB', err));

export const elevatorSchema = new mongoose.Schema({
  id: Number,
  currentFloor: Number,
  status: String,
  destinationFloor: Number,
});

export const Elevator = mongoose.model('Elevator', elevatorSchema);

async function createElevator(id) {
  const elevator = new Elevator({
    id: id,
    currentFloor: 0,
    status: 'idle',
    destinationFloor: 0
  }) 
  const result = await elevator.save();
  console.log(result);
}
// createElevator(1);
// createElevator(2);
// createElevator(3);

getRoutes.forEach(route => {
  app.get(route.path, route.handler);
});

putRoutes.forEach(route => {
  app.put(route.path, route.handler);
});

app.post('/api/elevators/call', callElevatorRouteHandler);
// callElevatorAPI([10, 15, 20, 22, 23, 24]);
callElevatorAPI([15, 25, 35]);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

export default { elevatorSchema, Elevator };