import { mintTokensMachine } from "@/machines/mintTokensMachine";
import { walletAuthMachine } from "@/machines/walletAuthMachine";
import { useWalletAuthService } from "@/provider/WalletAuthProvider";
import { Inter } from "@next/font/google";
import * as fcl from "@onflow/fcl";
import { useInterpret, useMachine, useSelector } from "@xstate/react";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { walletAuthService } = useWalletAuthService();
  const isLoggedIn = useSelector(walletAuthService, (state) => state.matches("LOGGED_IN"));
  const isLoading = useSelector(walletAuthService, (state) => state.context.loading);
  const { send } = walletAuthService;

  return (
    <>
      <main className={`${inter.className} flex flex-col  w-screen h-screen bg-black/90 justify-center items-center`}>
        <div className="flex flex-col items-center">
          {" "}
          <Image src={"/space-token.svg"} alt="Space Token" width={120} height={120} />
          <h1 className="mt-2 text-4xl font-bold text-transparent uppercase bg-clip-text bg-gradient-to-tr from-yellow-400 to-yellow-600">
            Space Token
          </h1>
          <p className="text-white/80">A token from the Flow Blockchain</p>
        </div>
        <div className="w-10/12 p-4 mt-4 text-white border rounded-lg bg-gray-700/30 border-box lg:w-1/2 xl:w-1/4 border-gray-400/50">
          {isLoggedIn ? (
            <>
              <MintTokensForm />
              <button className="ml-2" onClick={() => send("disconnect")}>
                Disconnect
              </button>
            </>
          ) : (
            <button
              disabled={isLoading}
              onClick={() => send("signInToWallet")}
              className="p-2 px-4 border rounded-lg disabled:bg-gray-900 bg-gray-400/50"
            >
              {isLoading ? "Loading..." : "Sign in"}
            </button>
          )}
        </div>
      </main>
    </>
  );
}

const MintTokensForm = () => {
  const [state, send] = useMachine(mintTokensMachine, {
    services: {
      mintTokens: async (ctx) => {
        console.log("MINT TOKENS", ctx);
        return true;
      },
    },
  });

  return (
    <>
      <h2>Mint Elite Tokens:</h2>
      <input
        className="w-full p-2 mt-2 mb-4 text-gray-800 border rounded-lg border-gray-400/50"
        placeholder="Amount to mint"
        type={"number"}
        min={0.00001}
        step={0.00001}
        value={state.context.amountToMint}
        onChange={(e) => send({ type: "ENTER_AMOUNT_TO_MINT", value: parseFloat(e.target.value ?? 0) })}
      />
      {!!state.context.error && <p className="mb-2 text-red-300">{state.context.error.message}</p>}
      <button className="p-2 px-4 border rounded-lg bg-gray-400/50" onClick={() => send("SUBMIT")}>
        Mint tokens
      </button>
    </>
  );
};
