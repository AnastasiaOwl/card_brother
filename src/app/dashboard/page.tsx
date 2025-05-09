"use client";  
import SpriteWalker from "../components/SpriteWolker";

export default function Dashboard() {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <SpriteWalker speed={250} width={150} height={150}/>
      </main>
    )
  }