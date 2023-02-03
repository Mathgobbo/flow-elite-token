import { createContext, ReactNode, useContext } from "react";
import * as fcl from "@onflow/fcl";
import { useInterpret, useSelector } from "@xstate/react";
import { walletAuthMachine } from "@/machines/walletAuthMachine";
import { InterpreterFrom } from "xstate";

export const WalletAuthContext = createContext({ walletAuthService: {} as InterpreterFrom<typeof walletAuthMachine> });
export const WalletAuthProvider = ({ children }: { children: ReactNode }) => {
  const walletAuthService = useInterpret(walletAuthMachine, {
    services: {
      signInService: async () => {
        const response = await fcl.logIn();
        console.log(response.addr);
        const hasVault = await fcl.query({
          cadence: `
            import SpaceToken from 0xSpaceToken
            import FungibleToken from 0xFungibleToken

            pub fun main(account: Address): Bool {
              return getAccount(account)
              .getCapability<&{FungibleToken.Receiver}>(SpaceToken.ReceiverPublicPath)
              .borrow() != nil
            }
          `,
          args: (arg: any, t: any) => [arg(response.addr, t.Address)],
        });

        console.log(`User has Vault?`, hasVault);
        if (!hasVault) {
          const transactionId = await fcl.mutate({
            cadence: `
            import SpaceToken from 0xSpaceToken
            import FungibleToken from 0xFungibleToken

            transaction() {
              prepare(signer: AuthAccount) {
                let vault <- SpaceToken.createEmptyVault()
                signer.save(<-vault, to: SpaceToken.VaultStoragePath)
                //Create Receiver link
                signer.link<&{FungibleToken.Receiver}>(SpaceToken.ReceiverPublicPath, target: SpaceToken.VaultStoragePath)
                signer.link<&SpaceToken.Vault{FungibleToken.Balance}>(SpaceToken.VaultPublicPath, target: SpaceToken.VaultStoragePath)
              }
            }            
            `,
            proposer: fcl.currentUser,
            payer: fcl.currentUser,
            authorizations: [fcl.currentUser],
          });
          const transaction = await fcl.tx(transactionId).onceSealed();
          console.log(transaction);
        }
        if (response.addr) return response;
        throw new Error("Erro ao login");
      },
      disconnectWallet: async () => {
        await fcl.unauthenticate();
      },
    },
  });

  return <WalletAuthContext.Provider value={{ walletAuthService }}>{children}</WalletAuthContext.Provider>;
};

export const useWalletAuthService = () => useContext(WalletAuthContext);
