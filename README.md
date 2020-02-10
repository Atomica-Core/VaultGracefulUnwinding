# VaultGracefulUnwinding
A risk mitigation service for MakerDAO vaults.  Make sure you don't get hit with a 13% liquidation fee.  This a free tool that can be integrated into existing platform as a value add service with a distributor fee.

We offer to wallet providers to embed Graceful Unwinding widget in their software applications. When a Vault Collateralizaton trigger (collateralization fits a certain Graceful Unwinding range %) is hit then collateral up to maximum amount that Maker allows (lowest that collateralization % can go) is extracted and then sold for DAI with the proceeds being used to pay back the loan. This happens in perpetuity until the loan is fully paid off. 

In other words, Your vault is monitored by an external keeper and when collateralization approaches 165% (Maker liquidation is at 150%) a partial liquidation is triggered. ~9% of your collateral (actually, all available by Maker free collateral) is extracted by the keeper (taking collateralization from 165% to ~150%) and sold for DAI. This DAI is then used to pay down a portion of the outstanding debt of the vault which should bring collateralization back up to ~176%.

There are three contracts, participating the process: UnwindFactory, Unwind, and CDPManager (Maker's contract). UnwindFactory and Unwind have all public methods on them.

## UnwindFactory
Acts as a “registry” contract for all the Partners who call appropriate method to start offering GU to its users. It has the following methods with parameters:
- `join ({period in seconds to charge fee for}, {fee amount for the period}, {fee type - flat or percent rate})` which is called by a Partner, who would like to distribute GU its users. It triggers an appropriate for this Partner Unwind contract creation, adding this contract to the GU service and giving the opportunity to charge fee from users for the service;
- `register` will throw an appropriate for this specific Unwind contract and Vaults CDPManager contract to interact with. It verifies which are the correct Unwind contracts to interact with any specific Vault. This method also saves the data about Unwind contracts to interact with;
- `registerToken` registers at a “wrapped” form of both ETH and ERC-20 tokens of available for GU Maker collateral types. It also saves the data about collateral tokens in which protected Vaults are nominated.

## Unwind 
This contract is created for each “joined” Partner and this contract will, eventually, perform Graceful Unwinding. It will “know” what is the Partner software app related to it and what are the fee parameters to be charged from user Vaults in favor of Partner. It has two simple methods only:
- `charge` to collect fee from all the Vaults at this Partner, which have activated GU;
- `unwind` to execute GU set of interactions with the protected Vault(s) when they’re triggered.

## CDPManager 
It is one of many Maker’s contracts which has several methods, but we’re interested in only one. Calling this method a Vault user enables Graceful Unwinding for his Vault(s):
- `cdpAllow ({cdp ID}, {address user}, {unit ok})` to set allowance to Graceful Unwinding to perform unwinding actions on behalf of Vault user.

Full product documentation is available here https://docs.atomica.org/technical/graceful-unwinding
