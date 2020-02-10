const UnwindFactory = artifacts.require("UnwindFactory");

const kovan = {
    "DEPLOYER": "0xdB33dFD3D61308C33C63209845DaD3e6bfb2c674",
    "MULTICALL": "0xC6D81A2e375Eee15a20E6464b51c5FC6Bb949fdA",
    "FAUCET": "0x57aAeAE905376a4B1899bA81364b4cE2519CBfB3",
    "MCD_DEPLOY": "0x13141b8a5E4A82Ebc6b636849dd6A515185d6236",
    "MCD_GOV": "0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD",
    "GOV_GUARD": "0xE50303C6B67a2d869684EFb09a62F6aaDD06387B",
    "MCD_ADM": "0xbBFFC76e94B34F72D96D054b31f6424249c1337d",
    "MCD_VAT": "0xbA987bDB501d131f766fEe8180Da5d81b34b69d9",
    "MCD_JUG": "0xcbB7718c9F39d05aEEDE1c472ca8Bf804b2f1EaD",
    "MCD_CAT": "0x0511674A67192FE51e86fE55Ed660eB4f995BDd6",
    "MCD_VOW": "0x0F4Cbe6CBA918b7488C26E29d9ECd7368F38EA3b",
    "MCD_JOIN_DAI": "0x5AA71a3ae1C0bd6ac27A1f28e1415fFFB6F15B8c",
    "MCD_FLAP": "0x064cd5f762851b1af81Fd8fcA837227cb3eC84b4",
    "MCD_FLOP": "0x145B00b1AC4F01E84594EFa2972Fce1f5Beb5CED",
    "MCD_PAUSE": "0x8754E6ecb4fe68DaA5132c2886aB39297a5c7189",
    "MCD_PAUSE_PROXY": "0x0e4725db88Bb038bBa4C4723e91Ba183BE11eDf3",
    "MCD_GOV_ACTIONS": "0x0Ca17E81073669741714354f16D800af64e95C75",
    "MCD_DAI": "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa",
    "MCD_SPOT": "0x3a042de6413eDB15F2784f2f97cC68C7E9750b2D",
    "MCD_POT": "0xEA190DBDC7adF265260ec4dA6e9675Fd4f5A78bb",
    "MCD_END": "0x24728AcF2E2C403F5d2db4Df6834B8998e56aA5F",
    "MCD_ESM": "0x0C376764F585828ffB52471c1c35f855e312a06c",
    "PROXY_ACTIONS": "0xd1D24637b9109B7f61459176EdcfF9Be56283a7B",
    "PROXY_ACTIONS_END": "0x5652779B00e056d7DF87D03fe09fd656fBc322DF",
    "PROXY_ACTIONS_DSR": "0xc5CC1Dfb64A62B9C7Bb6Cbf53C2A579E2856bf92",
    "CDP_MANAGER": "0x1476483dD8C35F25e568113C5f70249D3976ba21",
    "GET_CDPS": "0x592301a23d37c591C5856f28726AF820AF8e7014",
    "PROXY_FACTORY": "0xe11E3b391F7E8bC47247866aF32AF67Dd58Dc800",
    "PROXY_REGISTRY": "0x64A436ae831C1672AE81F674CAb8B6775df3475C",
    "ETH": "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
    "PIP_ETH": "0x75dD74e8afE8110C8320eD397CcCff3B8134d981",
    "MCD_JOIN_ETH_A": "0x775787933e92b709f2a3C70aa87999696e74A9F8",
    "MCD_FLIP_ETH_A": "0xB40139Ea36D35d0C9F6a2e62601B616F1FfbBD1b",
    "BAT": "0x9f8cFB61D3B2aF62864408DD703F9C3BEB55dff7",
    "PIP_BAT": "0x5C40C9Eb35c76069fA4C3A00EA59fAc6fFA9c113",
    "MCD_JOIN_BAT_A": "0x2a4C485B1B8dFb46acCfbeCaF75b6188A59dBd0a",
    "MCD_FLIP_BAT_A": "0xC94014A032cA5fCc01271F4519Add7E87a16b94C",
    "SAI": "0xC4375B7De8af5a38a93548eb8453a498222C4fF2",
    "PIP_SAI": "0x62eaf847dfd5De95a09a2708366a0525749A1f6D",
    "MCD_JOIN_SAI": "0x2d2672D655C95016e19909174d1fC72A6DE7D381",
    "MCD_FLIP_SAI": "0x2F68D2A62ffeBF9Cf09b3908C6D423109b77254A",
    "PROXY_PAUSE_ACTIONS": "0x7c52826c1efEAE3199BDBe68e3916CC3eA222E29",
    "PROXY_DEPLOYER": "0xA9fCcB07DD3f774d5b9d02e99DE1a27f47F91189",
    "SAI_TUB": "0xa71937147b55Deb8a530C7229C442Fd3F31b7db2",
    "MIGRATION": "0x411B2Faa662C8e3E5cF8f01dFdae0aeE482ca7b0",
    "MIGRATION_PROXY_ACTIONS": "0xF56765d255463139d3aff1613705a5520764Ab93",
    "OASIS_TRADE": "0x4A6bC4e803c62081ffEbCc8d227B5a87a58f1F8F",
}

const mainnet = {
    "DEPLOYER": "0xdDb108893104dE4E1C6d0E47c42237dB4E617ACc",
    "MULTICALL": "0x5e227AD1969Ea493B43F840cfF78d08a6fc17796",
    "FAUCET": "0x0000000000000000000000000000000000000000",
    "MCD_DEPLOY": "0xbaa65281c2FA2baAcb2cb550BA051525A480D3F4",
    "MCD_GOV": "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
    "GOV_GUARD": "0x6eEB68B2C7A918f36B78E2DB80dcF279236DDFb8",
    "MCD_ADM": "0x9eF05f7F6deB616fd37aC3c959a2dDD25A54E4F5",
    "MCD_VAT": "0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B",
    "MCD_JUG": "0x19c0976f590D67707E62397C87829d896Dc0f1F1",
    "MCD_CAT": "0x78F2c2AF65126834c51822F56Be0d7469D7A523E",
    "MCD_VOW": "0xA950524441892A31ebddF91d3cEEFa04Bf454466",
    "MCD_JOIN_DAI": "0x9759A6Ac90977b93B58547b4A71c78317f391A28",
    "MCD_FLAP": "0xdfE0fb1bE2a52CDBf8FB962D5701d7fd0902db9f",
    "MCD_FLOP": "0x4D95A049d5B0b7d32058cd3F2163015747522e99",
    "MCD_PAUSE": "0xbE286431454714F511008713973d3B053A2d38f3",
    "MCD_PAUSE_PROXY": "0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB",
    "MCD_GOV_ACTIONS": "0x4F5f0933158569c026d617337614d00Ee6589B6E",
    "MCD_DAI": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "MCD_SPOT": "0x65C79fcB50Ca1594B025960e539eD7A9a6D434A3",
    "MCD_POT": "0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7",
    "MCD_END": "0xaB14d3CE3F733CACB76eC2AbE7d2fcb00c99F3d5",
    "MCD_ESM": "0x0581A0AbE32AAe9B5f0f68deFab77C6759100085",
    "PROXY_ACTIONS": "0x82ecD135Dce65Fbc6DbdD0e4237E0AF93FFD5038",
    "PROXY_ACTIONS_END": "0x069B2fb501b6F16D1F5fE245B16F6993808f1008",
    "PROXY_ACTIONS_DSR": "0x07ee93aEEa0a36FfF2A9B95dd22Bd6049EE54f26",
    "CDP_MANAGER": "0x5ef30b9986345249bc32d8928B7ee64DE9435E39",
    "GET_CDPS": "0x36a724Bd100c39f0Ea4D3A20F7097eE01A8Ff573",
    "PROXY_FACTORY": "0xA26e15C895EFc0616177B7c1e7270A4C7D51C997",
    "PROXY_REGISTRY": "0x4678f0a6958e4D2Bc4F1BAF7Bc52E8F3564f3fE4",
    "ETH": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "PIP_ETH": "0x81FE72B5A8d1A857d176C3E7d5Bd2679A9B85763",
    "MCD_JOIN_ETH_A": "0x2F0b23f53734252Bda2277357e97e1517d6B042A",
    "MCD_FLIP_ETH_A": "0xd8a04F5412223F513DC55F839574430f5EC15531",
    "BAT": "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
    "PIP_BAT": "0xB4eb54AF9Cc7882DF0121d26c5b97E802915ABe6",
    "MCD_JOIN_BAT_A": "0x3D0B1912B66114d4096F48A8CEe3A56C231772cA",
    "MCD_FLIP_BAT_A": "0xaA745404d55f88C108A28c86abE7b5A1E7817c07",
    "SAI": "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359",
    "PIP_SAI": "0x54003DBf6ae6CBa6DDaE571CcdC34d834b44Ab1e",
    "MCD_JOIN_SAI": "0xad37fd42185Ba63009177058208dd1be4b136e6b",
    "MCD_FLIP_SAI": "0x5432b2f3c0DFf95AA191C45E5cbd539E2820aE72",
    "PROXY_PAUSE_ACTIONS": "0x6bda13D43B7EDd6CAfE1f70fB98b5d40f61A1370",
    "PROXY_DEPLOYER": "0x1b93556AB8dcCEF01Cd7823C617a6d340f53Fb58",
    "SAI_TUB": "0x448a5065aeBB8E423F0896E6c5D525C040f59af3",
    "MIGRATION": "0xc73e0383F3Aff3215E6f04B0331D58CeCf0Ab849",
    "MIGRATION_PROXY_ACTIONS": "0x2E1F6062d9fB227069741E40f89186DF222FB426",
    "OASIS_TRADE": "0x794e6e91555438aFc3ccF1c5076A74F42133d08D",
}

module.exports = async (deployer, network) => {
    const factory = await UnwindFactory.deployed()

    if (network === 'kovan') {
        await factory.register(web3.utils.fromUtf8('SPOT'), kovan["MCD_SPOT"]);
        await factory.register(web3.utils.fromUtf8('VAT'), kovan["MCD_VAT"]);
        await factory.register(web3.utils.fromUtf8('JUG'), kovan["MCD_JUG"]);
        await factory.register(web3.utils.fromUtf8('DAI_JOIN'), kovan["MCD_JOIN_DAI"]);

        await factory.register(web3.utils.fromUtf8('ETH-A'), kovan["MCD_JOIN_ETH_A"]);
        await factory.registerToken(web3.utils.fromUtf8('ETH-A'), kovan["ETH"]);

        await factory.register(web3.utils.fromUtf8('BAT-A'), kovan["MCD_JOIN_BAT_A"]);
        await factory.registerToken(web3.utils.fromUtf8('BAT-A'), kovan["BAT"]);

        await factory.register(web3.utils.fromUtf8('CDP_MANAGER'), kovan["CDP_MANAGER"]);
        await factory.register(web3.utils.fromUtf8('DAI'), kovan["MCD_DAI"]);
        await factory.register(web3.utils.fromUtf8('OASIS_TRADE'), kovan["OASIS_TRADE"]);
        await factory.register(web3.utils.fromUtf8('WETH'), kovan["ETH"]);
    }

    if (network === 'mainnet') {
        await factory.register(web3.utils.fromUtf8('SPOT'), mainnet["MCD_SPOT"]);
        await factory.register(web3.utils.fromUtf8('VAT'), mainnet["MCD_VAT"]);
        await factory.register(web3.utils.fromUtf8('JUG'), mainnet["MCD_JUG"]);
        await factory.register(web3.utils.fromUtf8('DAI_JOIN'), mainnet["MCD_JOIN_DAI"]);

        await factory.register(web3.utils.fromUtf8('ETH-A'), mainnet["MCD_JOIN_ETH_A"]);
        await factory.registerToken(web3.utils.fromUtf8('ETH-A'), mainnet["ETH"]);

        await factory.register(web3.utils.fromUtf8('BAT-A'), mainnet["MCD_JOIN_BAT_A"]);
        await factory.registerToken(web3.utils.fromUtf8('BAT-A'), mainnet["BAT"]);

        await factory.register(web3.utils.fromUtf8('CDP_MANAGER'), mainnet["CDP_MANAGER"]);
        await factory.register(web3.utils.fromUtf8('DAI'), mainnet["MCD_DAI"]);
        await factory.register(web3.utils.fromUtf8('OASIS_TRADE'), mainnet["OASIS_TRADE"]);
        await factory.register(web3.utils.fromUtf8('WETH'), mainnet["ETH"]);
    }
}
