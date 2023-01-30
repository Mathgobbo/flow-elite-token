import { tokenDetailsMachine } from "@/machines/tokenDetailsMachine";
import * as fcl from "@onflow/fcl";
import { useMachine } from "@xstate/react";
import Image from "next/image";
export const TokenDetails = () => {
  const [state, send] = useMachine(tokenDetailsMachine, {
    services: {
      fetchTokenDetails: async () => {
        const response = await fcl.query({
          cadence: `
          import SpaceToken from 0xSpaceToken

          pub struct TokenDetails {
            pub let totalSupply: UFix64
            pub let VaultPublicPath: PublicPath

            init(totalSupply: UFix64, VaultPublicPath: PublicPath ){
              self.VaultPublicPath = VaultPublicPath
              self.totalSupply = totalSupply
            }
          }
          
          pub fun main(): TokenDetails {
            return TokenDetails(totalSupply: SpaceToken.totalSupply, VaultPublicPath: SpaceToken.VaultPublicPath)
          }
          `,
        });
        return response;
      },
    },
  });
  return (
    <div className="flex flex-col items-center text-white">
      {" "}
      <Image src={"/space-token.svg"} alt="Space Token" width={120} height={120} />
      <h1 className="mt-2 text-4xl font-bold text-transparent uppercase bg-clip-text bg-gradient-to-tr from-yellow-400 to-yellow-600">
        Space Token
      </h1>
      <p className="text-white/80">A token from the Flow Blockchain</p>
      {/* <p>{JSON.stringify(state.value)}</p>
      <p>{JSON.stringify(state.context)}</p> */}
    </div>
  );
};
