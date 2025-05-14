"use client";  
import WelcomeSplash from "../components/WelcomeSplash";

export default function Dashboard() {
    return (
      <>
      <div className=" h-screen bg-yellow-200">
          <div ><WelcomeSplash /></div>
          <div>
            <iframe
              src="/dragonbones/girlAnimation.html"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="DragonBones Girl Animation"
            />
          </div>
    </div>
      
    </>

    )
  }