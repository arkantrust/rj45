const path = "./tests.json";

interface Vector {
    x: number,
    y: number,
    z: number
}

interface Measurement {
    accel: Vector,
    gyro: Vector,
    timestamp: number
}

interface Test {
    type: 'footing' | 'heeling',
    measurements: Measurement[]
}

// Create tests with random data
const tests: Test[] = [];
for (let i = 0; i < 7; i++) {
    const measurements: Measurement[] = [];
    for (let j = 0; j < 210; j++) {
        measurements.push({
            accel: {
                x: Math.random() + 9.81,
                y: Math.random(),
                z: Math.random()
            },
            gyro: {
                x: Math.random() + 9.81,
                y: Math.random(),
                z: Math.random()
            },
            timestamp: Date.now()
        });
    }
    tests.push({
        type: Math.random() > 0.5 ? 'footing' : 'heeling',
        measurements
    });
    await Bun.sleep(24);
}

// Write a json file with the tests
const data = JSON.stringify(tests, null, 2);
await Bun.write(path, data);

// Check if the file was written
const exists = await Bun.file(path).exists;
if (!exists) {
    throw new Error(`Failed to write the content to ${path}`);
}

// Log the result
console.log(`Wrote tests to ${path}`);