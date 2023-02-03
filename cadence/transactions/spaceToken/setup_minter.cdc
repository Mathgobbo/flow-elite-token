

import SpaceToken from "../../contracts/SpaceToken.cdc"

transaction(amountAllowed: UFix64) {

  prepare(signer: AuthAccount){
    //Admin must create Minter and asign to yourself
    let adminReference = signer.borrow<&SpaceToken.Administrator>(from: SpaceToken.AdminStoragePath) ?? panic("Not possible to borrow admin")
    let minterResource <- adminReference.createNewMinter(allowedAmount: amountAllowed);
    signer.save(<-minterResource, to: /storage/spaceTokenMinterPath)
    signer.link<&SpaceToken.Minter>(/public/spaceTokenMinterPath, target: /storage/SpaceTokenMinterPath)
  }
}
 