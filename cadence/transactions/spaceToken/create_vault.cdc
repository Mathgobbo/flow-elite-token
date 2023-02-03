
import SpaceToken from "../../contracts/SpaceToken.cdc"
import FungibleToken from "../../contracts/FungibleToken.cdc"
import MetadataViews from "../../contracts/utility/MetadataViews.cdc"

transaction() {
  prepare(signer: AuthAccount){
    // Return early if the account already stores a SpaceToken Vault
    if signer.borrow<&SpaceToken.Vault>(from: SpaceToken.VaultStoragePath) != nil {
        log("User already has a Space Token vault")
        return
    }
    let vault <- SpaceToken.createEmptyVault();
    signer.save<@SpaceToken.Vault>(<-vault, to: SpaceToken.VaultStoragePath);

    signer.link<&SpaceToken.Vault{FungibleToken.Receiver}>(SpaceToken.ReceiverPublicPath, target: SpaceToken.VaultStoragePath);
    
    signer.link<&SpaceToken.Vault{FungibleToken.Balance, MetadataViews.Resolver}>(SpaceToken.VaultPublicPath, target: SpaceToken.VaultStoragePath);
  }
}