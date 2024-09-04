# Requirements

## Terminology

Device: The physical hardware used to measure the patient's motor actions.

Software: The application used to record, visualize, and transmit the data collected by the device.

Database: The storage system used to store the data collected by the device and software.

System: The entire system, including the device, software, and database.

Measurement: The process of recording the patient's motor actions using the device.

Check-up: A session where the evaluator measures the patient's motor actions.

Patient: A person who undergoes measurements.

Evaluator: A person who conducts measurements on patients.

System Administrator (Admin): A person who has access to the system for administrative purposes.

## User Management (UM)

- **UM1 - Patient Registration**: When an evaluator or admin attempt to register a patient, the system will allow them to enter the patient's name, phone number, identity card number, and email address.

- **UM2 - Patient Lookup**: When an evaluator or admin attempt to look up a patient by their identity card number, the system will display the patient's data along with all recorded measurements and/or check-ups.

- **UM3 - Evaluator Registration**: When an admin attempts to register an evaluator, the system will allow them to enter the evaluator's name, identity card number, phone number, email address, and job title.

- **UM4 - Evaluator Lookup**: When an admin attempts to look up an evaluator by their identity card number, the system will display all measurements conducted by the evaluator.

- **UM5 - System Administrator Registration**: When an admin attempts to register another admin, the system will allow them to enter the person's name, identity card number, phone number, email address, and job title.

- **UM6 - Authentication**: When a user attempts to access the system, the system will authenticate them, allowing access only if the user is an evaluator or admin.

- **UM7 - Patient Data Updates**: When a patient's details are updated, the system will log the changes and timestamp them for auditing purposes.

- **UM8 - Revocation of Access**: When an evaluator or admin access is revoked, the system will immediately terminate all active sessions and prevent further access.

## Measuring Process (MP)

- **MP1 - Motor Action Measurement**: While the device is in use, the system will measure the actions of tapping and stomping.

- **MP2 - Measurement Timestamping**: When a measurement is performed, the system will record the date and time of the measurement.

- **MP3 - Notes and Comments**: If the evaluator requests it during a measurement, the system will allow the addition of notes or comments.

- **MP4 - Measurement Interruption**: When a measurement session is interrupted, the system will allow the session to be restarted.

## Data Management (DM)

- **DM1 - Data Recording**: When signals are received from the sensors during measurement, the system will record them as readable data.

- **DM2 - Data Visualization**: When the measurement has concluded, the system will allow the visualization of the collected data.

- **DM3 - Data Transmission**: If the measurement has concluded and the system has an internet connection, the system will transmit the data to a remote database.

- **DM4 - Data Storage**: If the measurement has concluded and the system does not have an internet connection, the system will store the collected data locally.

- **DM5 - Data Export**: When the measurement has concluded, the system will allow the export of the collected data. Additionally, the system will permit the export of any recorded measurement.

- **DM6 - Data Encryption**: While data is in transit or at rest, the system will ensure its encryption.

- **DM7 - Data Conflict Resolution**: If a data conflict occurs during synchronization, the system will notify the user and provide options to resolve the conflict.

## Technical Requirements (TR)

- **TR1 - Efficient Synchronization**: When the internet connection is restored, the system will automatically upload all "offline" measurements to the remote database.

- **TR2 - Scalable System**: To prevent issues caused by exponential user growth, the system will be scalable up to at least 1000 concurrent users.

- **TR3 - Modular System**: To facilitate understanding and maintenance, the system will be modular.

- **TR4 - Durable Device**: Since the device may be exposed to impacts, water, dust, and other external elements, the device will be resistant to these conditions to ensure proper operation.

- **TR5 - Cost-Effectiveness**: Although the device must be made with high-quality materials, it will remain within a limited budget range.

- **TR6 - Accurate Device**: To avoid significant variations in data, the device sensors will be as accurate as possible.

- **TR7 - Portable Device**: To ensure transportability outside the lab, the device will have a minimalist design.

- **TR8 - Device Health Monitoring**: The system will include an interface for monitoring device health and status, alerting the user if maintenance or calibration is required.