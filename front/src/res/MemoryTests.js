function measurementInterval() {
    const MEAN_INTERVAL_IN_MS = 5 * 60 * 1000;
    return -Math.log(Math.random()) * MEAN_INTERVAL_IN_MS;
  }
  function scheduleMeasurement() {
    if (!performance.measureMemory) {
      console.log("performance.measureMemory() is not available.");
      return;
    }
    const interval = measurementInterval();
    console.log("Scheduling memory measurement in " +
        Math.round(interval / 1000) + " seconds.");
    setTimeout(performMeasurement, interval);
  }
  
  // Start measurements after page load on the main window.
  window.onload = function () {
    scheduleMeasurement();
  }
  async function performMeasurement() {
    // 1. Invoke performance.measureMemory().
    let result;
    try {
      result = await performance.measureMemory();
    } catch (error) {
      if (error instanceof DOMException &&
          error.name === "SecurityError") {
        console.log("The context is not secure.");
        return;
      }
      // Rethrow other errors.
      throw error;
    }
    // 2. Record the result.
    console.log("Memory usage:", result);
    // 3. Schedule the next measurement.
    scheduleMeasurement();
  }
