const HDWalletProvider =require('truffle-hdwallet-provider');
const Web3=require("web3");
const compiledFactory=require('../ethereum/build/CampaignFactory.json');

const provider= new HDWalletProvider(
    "any trap soccer okay reform rabbit require critic pact obvious idea kitchen",
    "https://rinkeby.infura.io/v3/c85bb269c1f74490b39b2496702f0865"
);

const web3=new Web3(provider);


const deploy= async () =>{
    const accounts= await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0] });


    console.log("Contract deployed to ", result.options.address);

}
deploy();




// 0xbd6b4a7B2e03564a2d14B6214FDef879ae33a436

