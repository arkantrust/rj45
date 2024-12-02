const path = "./tests.json";

interface Vector {
    x: number,
    y: number,
    z: number
}

interface Measurement {
    accel: Vector,
    gyro: Vector,
    time: number
}

interface Test {
    id: string,
    type: 'footing' | 'heeling',
    measurements: Measurement[],
    timestamp: number,
    evaluatorId: number,
    patientId: number
}

const NUM_TESTS = 1;

// Create tests with random data
const tests: Test[] = [];
for (let i = 0; i < NUM_TESTS; i++) {
    const measurements: Measurement[] = [];
    const t0 = Date.now()
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
            time: Date.now() - t0
        });
        await Bun.sleep(24);
    }
    tests.push({
        id: Bun.randomUUIDv7(),
        type: Math.random() > 0.5 ? 'footing' : 'heeling',
        measurements,
        timestamp: Date.now(),
        evaluatorId: Math.floor(Math.random() * 10),
        patientId: Math.floor(Math.random() * 10)
    });
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
console.log(`Wrote ${NUM_TESTS} test(s) to ${path} with ${tests[0].measurements.length} measurements.`);