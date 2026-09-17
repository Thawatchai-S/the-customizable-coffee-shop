export class HealthStatus {
  constructor({ status, uptimeSeconds, timestamp }) {
    this.status = status;
    this.uptimeSeconds = uptimeSeconds;
    this.timestamp = timestamp;
  }
}
