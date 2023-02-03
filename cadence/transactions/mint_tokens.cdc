import FungibleToken from "../contracts/FungibleToken.cdc"
import FlowToken from 0x0ae53cb6e3f42a79
import SpaceToken from "../contracts/SpaceToken.cdc"

/// This transaction is what the minter Account uses to mint new tokens
/// They provide the recipient address and amount to mint, and the tokens
/// are transferred to the address after minting

transaction(recipient: Address, amount: UFix64) {

    /// Reference to the Example Token Admin Resource object
    let tokenAdmin: &SpaceToken.Administrator

    /// Reference to the Fungible Token Receiver of the recipient
    let tokenReceiver: &{FungibleToken.Receiver}

    let userFlowBalanceProvider: &FungibleToken.Vault

    /// The total supply of tokens before the burn
    let supplyBefore: UFix64

    let minter: &SpaceToken.Minter;
    
    prepare(signer: AuthAccount) {
        self.supplyBefore = SpaceToken.totalSupply

        // Borrow a reference to the admin object
        self.tokenAdmin = signer.borrow<&SpaceToken.Administrator>(from: SpaceToken.AdminStoragePath)
            ?? panic("Signer is not the token admin")

        // Get the account of the recipient and borrow a reference to their receiver
        self.tokenReceiver = getAccount(recipient)
            .getCapability(SpaceToken.ReceiverPublicPath)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")

        self.userFlowBalanceProvider = signer.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault) ?? panic("Was not possible to borrow the FlowToken Receiver")

        // Create a minter and mint tokens
        let localMinter = signer.borrow<&SpaceToken.Minter>(from: /storage/spaceTokenMinterPath) 
        if(localMinter == nil) {
             let minterResource <- self.tokenAdmin.createNewMinter(allowedAmount: amount);
            signer.save(<-minterResource, to: /storage/spaceTokenMinterPath)
            signer.link<&SpaceToken.Minter>(/public/spaceTokenMinterPath, target: /storage/SpaceTokenMinterPath)
            self.minter = signer.borrow<&SpaceToken.Minter>(from: /storage/spaceTokenMinterPath) ?? panic ("MINTER NOT FOUND YET")
        }else {
            self.minter = signer.borrow<&SpaceToken.Minter>(from: /storage/spaceTokenMinterPath) ?? panic ("MINTER NOT FOUND YET")
        }

    }

    execute {

        let paymentVault <-self.userFlowBalanceProvider.withdraw(amount: amount) 
        
        let mintedVault <- self.minter.publicMintTokens(amount: amount, payment: <-paymentVault)

        // Deposit them to the receiever
        self.tokenReceiver.deposit(from: <-mintedVault)

    }

    post {
        SpaceToken.totalSupply == self.supplyBefore + amount: "The total supply must be increased by the amount"
    }
}
 