from pydantic import BaseModel

class Coordinate(BaseModel):
  x: float
  y: float
  z: float

class Measurement(BaseModel):
  accel: Coordinate
  gyro: Coordinate
  timestamp: int

class SignalData(BaseModel):
  accelerometer: list[dict]

class Test(BaseModel):
  id: str
  type: str
  measurements: list[Measurement]
  createdAt: int
  evaluatorId: int
  patientId: int