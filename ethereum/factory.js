import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xAc56a729c81E2ff399156129A5635B7f2BD0dEb4'
);

export default instance;
