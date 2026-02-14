const EventEmitter = require('events');

class GridSimulation extends EventEmitter {
  constructor() {
    super();
    this.state = {
      voltage: 230.0, // Normal: 220-240V
      frequency: 50.0, // Normal: 49.9-50.1Hz
      entropy: 100.0, // Normal: 95-100% (High randomness)
      status: "SAFE", // SAFE, COMPROMISED
      attackActive: false,
      attackType: null // "VOLTAGE_DROP", "FREQ_SPIKE", "GROVER"
    };
    this.intervalId = null;
  }

  start() {
    if (this.intervalId) return;
    console.log("[SIMULATION] Grid Simulation Started");
    this.intervalId = setInterval(() => this.update(), 2000);
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
    console.log("[SIMULATION] Grid Simulation Stopped");
  }

  update() {
    if (this.state.attackActive) {
      // Attack Mode
      if (this.state.attackType === "VOLTAGE_DROP") {
        this.state.voltage = Math.max(0, this.state.voltage * 0.5); // Rapid drop
        this.state.frequency = 50.0 + (Math.random() - 0.5) * 5; // Erratic frequency
        this.state.entropy = 90 + (Math.random() - 0.5) * 10; // Entropy unaffected
      } else if (this.state.attackType === "FREQ_SPIKE") {
        this.state.voltage = 230 + (Math.random() - 0.5) * 20; // Unstable voltage
        this.state.frequency = Math.min(65, this.state.frequency * 1.1); // Rapid spike
        this.state.entropy = 90 + (Math.random() - 0.5) * 10; // Entropy unaffected
      } else if (this.state.attackType === "GROVER") {
        this.state.voltage = 230 + (Math.random() - 0.5) * 1; // Voltage stable
        this.state.frequency = 50 + (Math.random() - 0.5) * 0.1; // Freq stable
        this.state.entropy = Math.max(0, this.state.entropy * 0.8); // ENTROPY COLLAPSE
      }

      const isPhysical = this.state.attackType !== "GROVER";
      if (this.state.status !== "COMPROMISED") {
        this.state.status = "COMPROMISED";
        this.emit('intrusion', {
          type: this.state.attackType,
          voltage: this.state.voltage.toFixed(1),
          frequency: this.state.frequency.toFixed(2),
          entropy: this.state.entropy.toFixed(1)
        });
      }
    } else {
      // Normal Mode
      // Random fluctuation: Voltage +/- 2V, Freq +/- 0.05Hz
      this.state.voltage = 230 + (Math.random() - 0.5) * 4;
      this.state.frequency = 50 + (Math.random() - 0.5) * 0.1;
      this.state.entropy = 95 + (Math.random() - 0.5) * 2; // High Entropy
      this.state.status = "SAFE";
    }
  }

  triggerAttack(type = "VOLTAGE_DROP") {
    this.state.attackActive = true;
    this.state.attackType = type;
    // this.state.status = "COMPROMISED"; // Let update() handle the transition
    console.log(`[SIMULATION] 🚨 Attack Triggered: ${type}`);
    this.update(); // Immediate update
  }

  reset() {
    this.state.attackActive = false;
    this.state.attackType = null;
    this.state.voltage = 230.0;
    this.state.frequency = 50.0;
    this.state.entropy = 100.0;
    this.state.status = "SAFE";
    console.log("[SIMULATION] System Reset to Normal");
  }

  getStatus() {
    return {
      ...this.state,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new GridSimulation();
