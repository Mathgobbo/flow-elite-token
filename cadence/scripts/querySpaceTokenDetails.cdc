   import SpaceToken from 0xSpaceToken

  struct TokenDetails {
    pub let totalSupply: UFix64
    pub let VaultPublicPath: PublicPath
  }
  
  pub fun main(): TokenDetails {
    return TokenDetails(totalSupply: SpaceToken.totalSupply, VaultPublicPath: SpaceToken.VaultPublicPath)
  }