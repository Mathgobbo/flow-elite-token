
import FungibleToken from "../../contracts/FungibleToken.cdc"
import FlowToken from 0x0ae53cb6e3f42a79
import SpaceToken from "../../contracts/SpaceToken.cdc"

pub fun main(account: Address): UFix64 {

    let vaultRef = getAccount(account)
        .getCapability(SpaceToken.VaultPublicPath)
        .borrow<&SpaceToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}