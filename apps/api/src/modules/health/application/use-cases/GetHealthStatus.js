import { HealthStatus } from '../../domain/entities/HealthStatus.js';

export class GetHealthStatus {
  execute() {
    return new HealthStatus({
      status: 'ok',
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }
}
