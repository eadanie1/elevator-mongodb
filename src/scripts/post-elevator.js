
import { Elevator } from "../../app.js";
import axios from 'axios';
import asyncLock from 'async-lock';
const lock = new asyncLock();

export let callsQueue = [];

export async function findClosestElevator(floor) {
  let closestElevator = null;
  let minDistance = Number.MAX_SAFE_INTEGER;

  const elevators = await Elevator
    .find({status: 'idle'})
  // console.log(elevators);
    
  for (const elevator of elevators) {
    const distance = Math.abs(elevator.currentFloor - floor);
    if (distance < minDistance) {
      minDistance = distance;
      closestElevator = elevator;
    }
  }
  return closestElevator;
}

export async function moveElevator(elevator) {
  const moveTime = Math.abs(elevator.destinationFloor - elevator.currentFloor) * 1000;
  await new Promise(resolve => setTimeout(resolve, moveTime));
  
  elevator.set({
    currentFloor: elevator.destinationFloor,
    status: 'idle',
    destinationFloor: 0
  })
    console.log(`Elevator ${elevator.id} reached floor ${elevator.currentFloor}`);
    await elevator.save();
    
    if (callsQueue.length > 0) {
      const call = callsQueue.shift();
      const queuedArray = [];
      queuedArray.push(call.floor);
      callElevator(queuedArray);
    }
  }
  
  export async function callElevator(floors) {
    if (!Array.isArray(floors)) {
      console.error('Invalid input. Expected an array of floors.');
      return;
    }
    
    for (const floor of floors) {
      let closestElevator = await findClosestElevator(floor);
      if (closestElevator.currentFloor === floor) {
        console.log(`Elevator ${closestElevator.id} is already at floor ${floor}`);
        // res.json({message: `Elevator ${closestElevator.id} is already at floor ${floor}`});
        continue;
      }
      if (closestElevator) {
        closestElevator.set({
          status: (closestElevator.currentFloor < floor) ? 'moving_up' : 'moving_down',
          destinationFloor: floor
      });
      await closestElevator.save();
      
      moveElevator(closestElevator);
      
    } else {
      callsQueue.push({ floor });
      console.log(`No idle elevators available. Call queued for floor ${floor}`);
    }
  }}
  
  export async function callElevatorAPI(floors) {
    try {
      const response = await axios.post('http://localhost:3000/api/elevators/call', { floors: floors });
      console.log(response.data);
    } catch (error) {
      console.error('Error calling elevator API:', error.response.data);
    }
  }
  
export async function callElevatorRouteHandler(req, res) {
  try {
    const { floors } = req.body;
    if (!Array.isArray(floors)) {
      throw new Error('Invalid input. Expected an array of floors.');
    }
  
      await callElevator(floors);
  
    // res.json({ message: `Elevators called for floors ${floors.join(', ')}` });
  } catch(err) {
    console.log('Error', err.message);
    res.status(400).json({ error: err.message });
  }
}

export default { callElevatorAPI, callElevatorRouteHandler };