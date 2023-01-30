import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { config } from "@onflow/fcl";
import { WalletAuthProvider } from "@/provider/WalletAuthProvider";

config({
  "accessNode.api": "https://rest-testnet.onflow.org", // Mainnet: "https://rest-mainnet.onflow.org"
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Mainnet: "https://fcl-discovery.onflow.org/authn"
  "app.detail.title": "Elite Token",
  "0xSpaceToken": "0xc9d00db2367afc65",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletAuthProvider>
      <Component {...pageProps} />;
    </WalletAuthProvider>
  );
}
