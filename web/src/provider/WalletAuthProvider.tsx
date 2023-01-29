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
