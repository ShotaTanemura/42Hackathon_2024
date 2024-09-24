import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Link href="/start">
        <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-6 px-12 rounded text-4xl">
          Start
        </a>
      </Link>
    </div>
  );
}
