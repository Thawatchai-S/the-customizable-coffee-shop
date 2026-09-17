import { GetHealthStatus } from '../../application/use-cases/GetHealthStatus.js';

const getHealthStatus = new GetHealthStatus();

export function getHealth(req, res) {
  res.json(getHealthStatus.execute());
}
