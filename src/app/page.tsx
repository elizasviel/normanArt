import Image from "next/image";
import prisma from "../../lib/prisma";
import Test from "./client";

const getStaticProps = async () => {
  const feed = await prisma.post.findMany();
  console.log(feed);
};

console.log();
getStaticProps();

export default function Home() {
  console.log("isthisaserver");

  return (
    <main>
      <Test />
    </main>
  );
}
