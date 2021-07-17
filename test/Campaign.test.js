const assert =require("assert");
const ganache = require("ganache-cli");
const Web3=require("web3");
const web3=new Web3(ganache.provider());

const compiledFactory=require("../ethereum/build/CampaignFactory.json");
const compiledCampaign=require("../ethereum/build/Campaign.json");


let accounts;
let factory;
let campaignaddress;
let campaign;

beforeEach(async () => {
    accounts=await web3.eth.getAccounts();


    factory= await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data:compiledFactory.bytecode})
    .send({from:accounts[0],gas:"1000000"})



    await factory.methods.createCampaign('100').send({
        from:accounts[0],
        gas:'1000000'
    });


    [campaignaddress]=await factory.methods.getDeployedCampaigns().call();
    campaign=await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignaddress
    );
});

describe('Campaigns',() =>{
    it("deploys a factory and campaign",()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it("mark caller as the manager of the campaign",async () =>{
        const manager=await campaign.methods.manager().call();
        assert.equal(accounts[0],manager);
    });

    it("allow users to contribute and add in approvers",async () =>{
        await campaign.methods.contribute().send({
            from:accounts[1],
            value:'200'
        });
        const iscontributer=await   campaign.methods.approvers(accounts[1]).call();
        assert(iscontributer);
    });
    it("check for minimum contribution",async () =>{
        try{
            await campaign.methods.contribute().send({
                from:accounts[1],
                value:'50'
            })
            assert(false);
        }catch(err){
            assert(err);
        }
    })
    it('allow manager to make request',async ()=>{
        await campaign.methods.createRequest('buy batteries','100',accounts[1]).send({
            from:accounts[0],
            gas:'1000000'
        })
        const request=await campaign.methods.requests(0).call();

        assert.equal('buy batteries',request.description);
    })
    it('process request',async () =>{
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10','ether')
        });
        await campaign.methods.createRequest('a',web3.utils.toWei('5','ether'),accounts[1]).send({
            from: accounts[0],
            gas:'1000000'
        });
        await campaign.methods.approveRequest(0).send({
            from:accounts[0],
            gas:'1000000'
        })
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas:'1000000'
        })

        let balance=await web3.eth.getBalance(accounts[1]);
        balance=await web3.utils.fromWei(balance,'ether');
        balance=parseFloat(balance);
        console.log(balance);
        assert(balance>103);
    })

})





