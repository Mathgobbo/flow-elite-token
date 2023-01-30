// This transaction is a template for a transaction to allow 
// anyone to add a Vault resource to their account so that 
// they can use the SpaceToken

import FungibleToken from "./../contracts/FungibleToken.cdc"
import SpaceToken from "./../contracts/SpaceToken.cdc"
import MetadataViews from "./../contracts/utility/MetadataViews.cdc"

transaction () {

    prepare(signer: AuthAccount) {

        // Return early if the account already stores a SpaceToken Vault
        if signer.borrow<&SpaceToken.Vault>(from: SpaceToken.VaultStoragePath) != nil {
            log("User already has a Space Token vault")
            return
        }

        // Create a new SpaceToken Vault and put it in storage
        signer.save(
            <-SpaceToken.createEmptyVault(),
            to: SpaceToken.VaultStoragePath
        )

        // Create a public capability to the Vault that only exposes
        // the deposit function through the Receiver interface
        signer.link<&SpaceToken.Vault{FungibleToken.Receiver}>(
            SpaceToken.ReceiverPublicPath,
            target: SpaceToken.VaultStoragePath
        )

        // Create a public capability to the Vault that exposes the Balance and Resolver interfaces
        signer.link<&SpaceToken.Vault{FungibleToken.Balance, MetadataViews.Resolver}>(
            SpaceToken.VaultPublicPath,
            target: SpaceToken.VaultStoragePath
        )
    }
}
