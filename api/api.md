# API

You can access the API [here](https://api.rj45.ddulce.app/docs).

Test it with this command:

``` bash
curl --json '{"type":"footing","measurements":[{"accel":{"x":10.0,"y":0.059,"z":0.10},"gyro":{"x":0.314,"y":0.52,"z":0.19}},{"accel":{"x":9.8,"y":-0.032,"z":0.15},"gyro":{"x":0.250,"y":0.48,"z":0.17}},{"accel":{"x":10.1,"y":0.040,"z":0.12},"gyro":{"x":0.312,"y":0.50,"z":0.20}},{"accel":{"x":9.9,"y":0.012,"z":0.09},"gyro":{"x":0.290,"y":0.55,"z":0.16}},{"accel":{"x":10.0,"y":-0.045,"z":0.13},"gyro":{"x":0.320,"y":0.51,"z":0.18}}]}' localhost:8080/tests
```