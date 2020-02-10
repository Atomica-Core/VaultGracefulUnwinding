const HDWalletProvider = require('truffle-hdwallet-provider');

const MNEMONIC = process.env.MNEMONIC
const INFURA_TOKEN= process.env.INFURA_TOKEN

module.exports = {
  networks: {
    kovan: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://kovan.infura.io/v3/${INFURA_TOKEN}`, 0, 4),
      network_id: 42,
      confirmation: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 6600000,
      gasPrice: 10 * (10 ** 9),
    },

    mainnet: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://mainnet.infura.io/v3/${INFURA_TOKEN}`, 0, 4),
      network_id: 1,
      confirmation: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 6600000,
      gasPrice: 5 * (10 ** 9),
    },
  },

  mocha: {
    timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.6.2",
      docker: true,
      settings: {
       optimizer: {
         enabled: false,
         runs: 200
       },
       evmVersion: "constantinople"
      }
    }
  }
}
