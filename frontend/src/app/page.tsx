import React from "react";
import Link from "next/link";

export default function Home() {
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
    </>
  );
}
