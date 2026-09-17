import { GetMasterData } from '../../application/use-cases/GetMasterData.js';
import { DrizzleMasterDataRepository } from '../database/DrizzleMasterDataRepository.js';

const getMasterData = new GetMasterData(new DrizzleMasterDataRepository());

export async function getMasterDataHandler(req, res) {
  const result = await getMasterData.execute();
  res.json(result);
}
