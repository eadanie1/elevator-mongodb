
import { Elevator } from "../../app.js";
import axios from 'axios';
import asyncLock from 'async-lock';
const lock = new asyncLock();

export let callsQueue = [];

export function findClosestElevator(floor) {
  let closestElevator = null;
  let minDistance = Number.MAX_SAFE_INTEGER;

  elevators.forEach(elevator => {
    if (elevator.status === 'idle') {
      const distance = Math.abs(elevator.currentFloor - floor);
      if (distance < minDistance) {
        minDistance = distance;
        closestElevator = elevator;
      }
    }
  });

  return closestElevator;
}

export async function moveElevator(elevator) {
  setTimeout(() => {
    elevator.currentFloor = elevator.destinationFloor;
    elevator.status = 'idle';
    elevator.destinationFloor = 0;
    console.log(`Elevator ${elevator.id} reached floor ${elevator.currentFloor}`);
    
    if (callsQueue.length > 0) {
      const call = callsQueue.shift();
      const queuedArray = [];
      queuedArray.push(call.floor);
      callElevator(queuedArray);
    }
  }, Math.abs(elevator.destinationFloor - elevator.currentFloor) * 1000); 
}

export async function callElevator(floors) {
  if (!Array.isArray(floors)) {
    console.error('Invalid input. Expected an array of floors.');
    return;
  }

  floors.forEach(floor => {
    const closestElevator = findClosestElevator(floor);
    if (closestElevator) {
      (closestElevator.currentFloor < floor) ? closestElevator.status = 'moving_up' : closestElevator.status = 'moving_down';
      closestElevator.destinationFloor = floor;
      moveElevator(closestElevator);
    } else {
      callsQueue.push({ floor });
      console.log(`No idle elevators available. Call queued for floor ${floor}`);
    }
  });
}

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
  
    res.json({ message: `Elevators called for floors ${floors.join(', ')}` });
  } catch(err) {
    console.log('Error', err.message);
    res.status(400).json({ error: err.message });
  }
}

export default { callElevatorAPI, callElevatorRouteHandler };