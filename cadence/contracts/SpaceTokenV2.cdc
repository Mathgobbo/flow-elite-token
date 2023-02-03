import FungibleToken from "./FungibleToken.cdc"
import MetadataViews from "./utility/MetadataViews.cdc"
import FungibleTokenMetadataViews from "./FungibleTokenMetadataViews.cdc"
import FlowToken from 0x0ae53cb6e3f42a79

pub contract SpaceTokenV2: FungibleToken {

    pub var totalSupply: UFix64
    
    /// Storage and Public Paths
    pub let VaultStoragePath: StoragePath
    pub let VaultPublicPath: PublicPath
    pub let ReceiverPublicPath: PublicPath
    pub let AdminStoragePath: StoragePath

    pub event TokensInitialized(initialSupply: UFix64)
    pub event TokensWithdrawn(amount: UFix64, from: Address?)
    pub event TokensDeposited(amount: UFix64, to: Address?)
    pub event TokensMinted(amount: UFix64)
    pub event TokensBurned(amount: UFix64)
    pub event MinterCreated(allowedAmount: UFix64)
    pub event BurnerCreated()


    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance, MetadataViews.Resolver {
        pub var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }

    
        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <-create Vault(balance: amount)
        }

        pub fun deposit(from: @FungibleToken.Vault) {
            let vault <- from as! @SpaceTokenV2.Vault
            self.balance = self.balance + vault.balance
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            vault.balance = 0.0
            destroy vault
        }

        destroy() {
            if self.balance > 0.0 {
                SpaceTokenV2.totalSupply = SpaceTokenV2.totalSupply - self.balance
            }
        }

        /// The way of getting all the Metadata Views implemented by SpaceToken
        ///
        /// @return An array of Types defining the implemented views. This value will be used by
        ///         developers to know which parameter to pass to the resolveView() method.
        ///
        pub fun getViews(): [Type]{
            return [Type<FungibleTokenMetadataViews.FTView>(),
                    Type<FungibleTokenMetadataViews.FTDisplay>(),
                    Type<FungibleTokenMetadataViews.FTVaultData>()]
        }

        /// The way of getting a Metadata View out of the SpaceToken
        ///
        /// @param view: The Type of the desired view.
        /// @return A structure representing the requested view.
        ///
        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<FungibleTokenMetadataViews.FTView>():
                    return FungibleTokenMetadataViews.FTView(
                        ftDisplay: self.resolveView(Type<FungibleTokenMetadataViews.FTDisplay>()) as! FungibleTokenMetadataViews.FTDisplay?,
                        ftVaultData: self.resolveView(Type<FungibleTokenMetadataViews.FTVaultData>()) as! FungibleTokenMetadataViews.FTVaultData?
                    )
                case Type<FungibleTokenMetadataViews.FTDisplay>():
                    let media = MetadataViews.Media(
                            file: MetadataViews.HTTPFile(
                            url: "https://https://flow-space-token.vercel.app/space-token.svg"
                        ),
                        mediaType: "image/svg+xml"
                    )
                    let medias = MetadataViews.Medias([media])
                    return FungibleTokenMetadataViews.FTDisplay(
                        name: "Space Token",
                        symbol: "SPACE",
                        description: "This fungible token is used as an example to help you develop your next FT #onFlow.",
                        externalURL: MetadataViews.ExternalURL("https://flow-space-token.vercel.app/"),
                        logos: medias,
                        socials: {}
                    )
                case Type<FungibleTokenMetadataViews.FTVaultData>():
                    return FungibleTokenMetadataViews.FTVaultData(
                        storagePath: SpaceTokenV2.VaultStoragePath,
                        receiverPath: SpaceTokenV2.ReceiverPublicPath,
                        metadataPath: SpaceTokenV2.VaultPublicPath,
                        providerPath: /private/spaceTokenVault,
                        receiverLinkedType: Type<&SpaceTokenV2.Vault{FungibleToken.Receiver}>(),
                        metadataLinkedType: Type<&SpaceTokenV2.Vault{FungibleToken.Balance, MetadataViews.Resolver}>(),
                        providerLinkedType: Type<&SpaceTokenV2.Vault{FungibleToken.Provider}>(),
                        createEmptyVaultFunction: (fun (): @SpaceTokenV2.Vault {
                            return <-SpaceTokenV2.createEmptyVault()
                        })
                    )
            }
            return nil
        }
    }


    pub fun createEmptyVault(): @Vault {
        return <-create Vault(balance: 0.0)
    }

    pub resource Administrator {
        pub fun createNewMinter(allowedAmount: UFix64): @Minter {
            emit MinterCreated(allowedAmount: allowedAmount)
            return <-create Minter(allowedAmount: allowedAmount)
        }
        pub fun createNewBurner(): @Burner {
            emit BurnerCreated()
            return <-create Burner()
        }
    }

    pub resource Minter {
        pub var allowedAmount: UFix64
        access(account) fun mintTokens(amount: UFix64): @SpaceTokenV2.Vault {
            pre {
                amount > 0.0: "Amount minted must be greater than zero"
                amount <= self.allowedAmount: "Amount minted must be less than the allowed amount"
            }
            SpaceTokenV2.totalSupply = SpaceTokenV2.totalSupply + amount
            self.allowedAmount = self.allowedAmount - amount
            emit TokensMinted(amount: amount)
            return <-create Vault(balance: amount)
        }

        pub fun publicMintTokens(amount: UFix64, payment: @FungibleToken.Vault): @SpaceTokenV2.Vault {
            pre {
                amount > 0.0: "Amount minted must be greater than zero"
                amount <= self.allowedAmount: "Amount minted must be less than the allowed amount"
                self.owner != nil: "This resource must have an owner to execute this function"
                payment.balance >= amount: "Your Flow playment must be greather than the amount you want to mint"
            }

            let ownerFlowReceiver = self.owner
            ?.getCapability(/public/flowTokenReceiver)
            ?.borrow<&{FungibleToken.Receiver}>()! ?? panic("Couldnt borrow owner's Flow vault");
            ownerFlowReceiver.deposit(from: <-payment) 

            SpaceTokenV2.totalSupply = SpaceTokenV2.totalSupply + amount
            self.allowedAmount = self.allowedAmount - amount
            emit TokensMinted(amount: amount)
            return  <- create Vault(balance: amount)
        }   

        init(allowedAmount: UFix64) {
            self.allowedAmount = allowedAmount
        }
    }

    pub resource Burner {
        pub fun burnTokens(from: @FungibleToken.Vault) {
            let vault <- from as! @SpaceTokenV2.Vault
            let amount = vault.balance
            destroy vault
            emit TokensBurned(amount: amount)
        }
    }

    init() {
        self.totalSupply = 1000000.0
        self.VaultStoragePath = /storage/spaceTokenVault
        self.AdminStoragePath = /storage/spaceTokenAdmin
        self.VaultPublicPath = /public/spaceTokenMetadata
        self.ReceiverPublicPath = /public/spaceTokenReceiver

        // Create the Vault with the total supply of tokens and save it in storage.
        let vault <- create Vault(balance: self.totalSupply)
        self.account.save(<-vault, to: self.VaultStoragePath)
        self.account.link<&{FungibleToken.Receiver}>(
            self.ReceiverPublicPath,
            target: self.VaultStoragePath
        )
        self.account.link<&SpaceTokenV2.Vault{FungibleToken.Balance}>(
            self.VaultPublicPath,
            target: self.VaultStoragePath
        )

        let admin <- create Administrator()
        self.account.save(<-admin, to: self.AdminStoragePath)

        // Emit an event that shows that the contract was initialized
        emit TokensInitialized(initialSupply: self.totalSupply)
    }
}
 