import { MintTokensForm } from "@/components/Home/MintTokensForm";
import { TokenDetails } from "@/components/TokenDetails";
import { useWalletAuthService } from "@/provider/WalletAuthProvider";
import { Inter } from "@next/font/google";
import { useSelector } from "@xstate/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { walletAuthService } = useWalletAuthService();
  const isLoggedIn = useSelector(walletAuthService, (state) => state.matches("LOGGED_IN"));
  const isLoading = useSelector(walletAuthService, (state) => state.context.loading);
  const { send } = walletAuthService;

  return (
    <>
      <main
        className={`${inter.className} flex flex-col  w-full min-h-screen box-border bg-black/90 justify-center items-center`}
      >
        <TokenDetails />
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
