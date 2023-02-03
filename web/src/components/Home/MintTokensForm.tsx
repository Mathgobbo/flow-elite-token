import { mintTokensMachine } from "@/machines/mintTokensMachine";
import { useWalletAuthService } from "@/provider/WalletAuthProvider";
import * as fcl from "@onflow/fcl";
import { useMachine, useSelector } from "@xstate/react";
import Image from "next/image";
import { FaArrowDown } from "react-icons/fa";
export const MintTokensForm = () => {
  const { walletAuthService } = useWalletAuthService();
  const user = useSelector(walletAuthService, (state) => state.context.user);
  const [state, send] = useMachine(mintTokensMachine, {
    services: {
      mintTokens: async (ctx) => {
        const transactionId = await fcl.mutate({
          cadence: `
        import SpaceToken from 0xSpaceToken
        import FungibleToken from 0xFungibleToken
        import MetadataViews from 0xMetadataViews
        import FlowToken from 0x7e60df042a9c0868

        transaction(){
          //1. Verify if user has SpaceTokenVault
          //2. Get Flow Vault
          //3. Call mint function that will return a SpaceTokenVault
          //4. Get user SpaceToken Vault
          //5. Deposit

          let spaceTokenVault: &SpaceToken.Vault
          
          prepare(signer: AuthAccount){
            self.spaceTokenVault = signer.borrow<&SpaceToken.Vault>(from: SpaceToken.VaultStoragePath) ?? panic("Vault not found")
               
          }
          execute {
            log(self.spaceTokenVault != nil)
          }
        }
      `,
          proposer: fcl.currentUser,
          payer: fcl.currentUser,
          authorizations: [fcl.currentUser],
        });

        const transaction = await fcl.tx(transactionId).onceSealed();
        console.log(transaction);
        return true;
      },
    },
  });

  return (
    <>
      <h2>Mint Elite Tokens:</h2>
      <div className="flex w-full p-2 mt-2 mb-2 text-gray-800 bg-white border rounded-lg border-gray-400/50">
        <Image src="/flow-logo.svg" alt="Flow Token" width={24} height={24} />
        <input
          className="w-full pl-2 outline-none"
          placeholder="Amount to mint"
          type={"number"}
          min={0.00001}
          step={0.00001}
          value={state.context.amountToMint}
          onChange={(e) => send({ type: "ENTER_AMOUNT_TO_MINT", value: parseFloat(e.target.value ?? 0) })}
        />
      </div>
      <div className="flex justify-center">
        <FaArrowDown className="w-4 h-4 text-white" />
      </div>
      <div className="flex w-full p-2 mt-2 mb-4 text-white bg-gray-800 border rounded-lg border-gray-400/50">
        <Image src="/space-token.svg" alt="Flow Token" width={24} height={24} />
        <input
          className="w-full pl-2 bg-transparent outline-none"
          placeholder="Amount to mint"
          disabled
          type={"number"}
          min={0.00001}
          step={0.00001}
          value={state.context.amountToMint}
          onChange={(e) => send({ type: "ENTER_AMOUNT_TO_MINT", value: parseFloat(e.target.value ?? 0) })}
        />
      </div>
      {!!state.context.error && <p className="mb-2 text-red-300">{state.context.error.message}</p>}
      <button className="p-2 px-4 border rounded-lg bg-gray-400/50" onClick={() => send("SUBMIT")}>
        Mint tokens
      </button>
    </>
  );
};
