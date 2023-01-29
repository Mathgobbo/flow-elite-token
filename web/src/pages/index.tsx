import { walletAuthMachine } from "@/machines/walletAuthMachine";
import { Inter } from "@next/font/google";
import * as fcl from "@onflow/fcl";
import { useInterpret, useSelector } from "@xstate/react";
import { Interpreter } from "xstate";

const inter = Inter({ subsets: ["latin"] });

fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org", // Mainnet: "https://rest-mainnet.onflow.org"
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Mainnet: "https://fcl-discovery.onflow.org/authn"
  "app.detail.title": "Elite Token",
});

export default function Home() {
  const walletAuthService = useInterpret(walletAuthMachine, {
    services: {
      signInService: async () => {
        const response = await fcl.logIn();
        console.log(response);
        if (response.addr) return response;
        throw new Error("Erro ao login");
      },
      disconnectWallet: async () => {
        await fcl.unauthenticate();
      },
    },
  });
  const isLoggedIn = useSelector(walletAuthService, (state) => state.matches("LOGGED_IN"));
  const isLoading = useSelector(walletAuthService, (state) => state.context.loading);
  const { send } = walletAuthService;

  return (
    <>
      <main className={`${inter.className} flex flex-col  w-screen h-screen bg-black/90 justify-center items-center`}>
        <div>
          {" "}
          <h1 className="text-4xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-tr from-yellow-400 to-yellow-600">
            Elite Token
          </h1>
          <p className="text-white/80">A token from the Flow Blockchain</p>
        </div>
        <div className="bg-gray-700/30 border-box w-10/12 lg:w-1/2 mt-4 xl:w-1/4 p-4 rounded-lg text-white border border-gray-400/50">
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
              className="p-2 px-4 disabled:bg-gray-900 bg-gray-400/50 rounded-lg border"
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
  return (
    <>
      <h2>Mint Elite Tokens:</h2>
      <input
        className="mt-2 mb-4 w-full p-2 rounded-lg border border-gray-400/50"
        placeholder="Amount to mint"
        type={"number"}
      />
      <button className="p-2 px-4  bg-gray-400/50 rounded-lg border">Mint tokens</button>
    </>
  );
};
