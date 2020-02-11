const UnwindFactory = artifacts.require("UnwindFactory");

module.exports = async (deployer, network, accounts) => {
    const factory = await UnwindFactory.deployed()

    const unwind = await factory.join(
        60 * 60 * 24,
        web3.utils.toWei("0.1", "ether"),
        true,
    );

    console.log('Unwind factory: ', factory.address);
    console.log('Unwind: ', unwind.logs[0].args.unwind);
    console.log('Beneficiary: ', accounts[0]);
}
