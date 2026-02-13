const grid = require('./simulation');

console.log("1. Setting up listener...");
grid.on('intrusion', (data) => {
    console.log("✅ EVENT RECEIVED:", data);
});

console.log("2. Triggering Attack...");
// We expect this to eventually emit an event, either immediately or on next update
grid.triggerAttack("VOLTAGE_DROP");

console.log("3. Waiting 3 seconds...");
setTimeout(() => {
    console.log("4. Done waiting.");
}, 3000);
