/* 
  Does resource memory checking on total amount of memory used 
  by the app via random intervaled tests
*/

function measurementInterval() {
    const MEAN_INTERVAL_IN_MS = 5 * 60 * 1000;
    return -Math.log(Math.random()) * MEAN_INTERVAL_IN_MS;
  }

  export const scheduleMeasurement = ()=> {
    if (!performance.measureMemory) {
      console.log("performance.measureMemory() is not available.");
      return;
    }
    const interval = measurementInterval();
    console.log("Scheduling memory measurement in " +
        Math.round(interval / 1000) + " seconds.");
    setTimeout(performMeasurement, interval);
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
    const stringifyHeapUse = (result)=>{
        const toMb = (Bytes) => {
            return (parseFloat(Bytes) * .000001)
            .toFixed(2)
            .toString();
        }
        let lowerBound = result.total.jsMemoryRange[0];
        let upperBound = result.total.jsMemoryRange[1];
        return "Between "+ toMb(lowerBound) + " MB" + " and " + toMb(upperBound) + " MB\n"

    }
    // 2. Record the result.
    console.log("(Memory usage)", stringifyHeapUse(result));
    // 3. Schedule the next measurement.
    scheduleMeasurement();
  }

 export default scheduleMeasurement; 