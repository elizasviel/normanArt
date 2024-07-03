import prisma from "../../../lib/prisma";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  const bumpers = await prisma.bumper.findMany();
  return new Response(JSON.stringify(bumpers));
}

export async function POST(request: Request) {
  const res = await request.json();

  const bumper = await prisma.bumper.create({
    data: {
      args: res.args, //somehow rounds to zero
      position: res.position,
      color: res.color,
    },
  });

  console.log(bumper);

  return new Response("POST Request recieved");
}
