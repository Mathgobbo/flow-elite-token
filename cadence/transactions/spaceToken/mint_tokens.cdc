import FungibleToken from "../../contracts/FungibleToken.cdc"
import FlowToken from 0x0ae53cb6e3f42a79
import SpaceToken from "../../contracts/SpaceToken.cdc"

transaction(amount: UFix64) {

    let userFlowBalanceProvider: &FungibleToken.Vault
    let supplyBefore: UFix64

    prepare(signer: AuthAccount) {
        self.supplyBefore = SpaceToken.totalSupply
        self.userFlowBalanceProvider = signer.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault) ?? panic("Was not possible to borrow the FlowToken Receiver")
    }

    execute {

        // Gets User Flow Vault
        let paymentVault <-self.userFlowBalanceProvider.withdraw(amount: amount) 

        // Borrow a reference to the admin object
        let tokenMinter = getAccount(0xf8d6e0586b0a20c7)
        .getCapability(/public/spaceTokenMinterPath)
        .borrow<&SpaceToken.Minter>() ?? panic("Account used to mint is NOT minter")
        
        let mintedVault <- tokenMinter.publicMintTokens(amount: amount, payment: <-paymentVault)

        // Get the account of the minter and borrow a reference to their receiver
        let tokenReceiver = getAccount(0xf8d6e0586b0a20c7)
            .getCapability(SpaceToken.ReceiverPublicPath)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")

        // Deposit them to the receiever
        tokenReceiver.deposit(from: <-mintedVault)
    
    }

    post {
        SpaceToken.totalSupply == self.supplyBefore + amount: "The total supply must be increased by the amount"
    }
}
 