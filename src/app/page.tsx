import dynamic from "next/dynamic";

const BallPit = dynamic(() => import("../components/BallPit"), { ssr: false });

export default function Home() {
  return (
    <main>
      <BallPit />
    </main>
  );
}
