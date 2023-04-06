const fs = require('fs');
// Read input file and parse data
const input = fs.readFileSync('input.txt', 'utf8');
const lines = input.split('\n');
const drones = [];
const packages = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.length === 0) continue;
  if (i === 0) {
    const droneData = line.replaceAll('[', '').replaceAll(']', '').split(',');
    for (let j = 0; j < droneData.length; j += 2) {
      const droneName = droneData[j].trim();
      const maxWeight = parseInt(droneData[j + 1].trim());
      drones.push({ name: droneName, maxWeight: maxWeight, currentWeight: 0, deliverie: [], trip: 0, trips: [] });
    }
  } else {
    const packageData = line.replaceAll('[', '').replaceAll(']', '').split(',');
    const locationName = packageData[0].trim();
    const packageWeight = parseInt(packageData[1].trim());
    packages.push({ location: locationName, weight: packageWeight });
  }
}

// Sort drones by maximum weight capacity in ascending order
drones.sort((a, b) => b.maxWeight - a.maxWeight);
// Sort packages by weight in descending order
packages.sort((a, b) => a.weight - b.weight);

// Make deliveries using drones
let currentDrone = 0;
for (let i = 0; i < packages.length; i++) {
  const package = packages[i];
  const drone = drones[currentDrone];

  if (drone.currentWeight + package.weight <= drone.maxWeight) {
    drone.deliverie.push(package.location);
    drone.currentWeight += package.weight;
  } else {
    currentDrone++;
    if (drone.deliverie.length > 0) {
      drone.trips.push({ trip: drone.trip + 1, locations: drone.deliverie });
    }
    drone.trip += 1;
    drone.deliverie = [];
    drone.currentWeight = 0;
    if (currentDrone >= drones.length) currentDrone = 0;
    i--; // retry this package on the next drone
  }
}

drones.sort((a, b) => a.name > b.name ? 1 : -1);

// Output delivery schedule
for (let i = 0; i < drones.length; i++) {
  const drone = drones[i];
  console.log(drone.name);
  console.log(drone.trips.reduce((previus, current) => {
    previus += `Trip #${current.trip}\n${current.locations.map((item => `[${item}]`)).join(`, `)}\n`;
    return previus;
  }, ""));
}

