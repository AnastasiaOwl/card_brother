"use client";  
import WelcomeSplash from "../components/WelcomeSplash";

export default function Dashboard() {
    return (
      <>
      <div ><WelcomeSplash /></div>
        <div style={{ width: 200, height: 200 }}>
        <iframe
          src="/dragonbones/girlAnimation.html"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          title="DragonBones Girl Animation"
        />
    </div>
    </>

    )
  }