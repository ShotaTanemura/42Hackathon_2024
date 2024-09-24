import React from "react";
import Link from "next/link";

type Env = {
  web3auth_client_id: string | undefined;
  biconomy_paymaster_api_key: string | undefined;
  sepolia_erc721_contract: string | undefined;
  mapbox_accesstoken: string | undefined;
};

export default function Home() {
  const env: Env = {
    web3auth_client_id: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
    biconomy_paymaster_api_key:
      process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY,
    sepolia_erc721_contract: process.env.NEXT_PUBLIC_SEPOLIA_ERC721_CONTRACT,
    mapbox_accesstoken: process.env.NEXT_PUBLIC_MAPBOX_ACCESSTOKEN,
  };

  return (
    <>
      <div>
        <Link href="/acceleration">
          <button>acceleration</button>
        </Link>
      </div>
      <div>
        <Link href="/web3">
          <button>web3</button>
        </Link>
      </div>
      <div>
        <p>web3auth_client_id:{env.web3auth_client_id}</p>
        <p>biconomy_paymaster_api_key:{env.biconomy_paymaster_api_key}</p>
        <p>sepolia_erc721_contract:{env.sepolia_erc721_contract}</p>
        <p>mapbox_accesstoken:{env.mapbox_accesstoken}</p>
      </div>
    </>
  );
}
