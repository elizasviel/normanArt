import prisma from "../../lib/prisma";

export const GET = (request: Request) => {
  return prisma.bumper.findMany().then((bumpers) => {
    return new Response(JSON.stringify(bumpers));
  });
};

/* 

The equivalent function, but with Async Await

export const GET = async (request: Request) => {
  const bumpers = await prisma.bumper.findMany();
  return new Response(JSON.stringify(bumpers));
};

*/

export const POST = async (request: Request) => {
  const req = await request.json();

  if (req === "remove") {
    await prisma.bumper.deleteMany();
  } else {
    const bumper = await prisma.bumper.create({
      data: {
        args: req.args, //somehow rounds to zero
        position: req.position,
        color: req.color,
      },
    });
  }

  const bumpers = await prisma.bumper.findMany();

  return new Response(JSON.stringify(bumpers));
};

/*

Why alias Bumper?

The same as 
export type {Bumper};

export const GET = async (request: Request) => {
  const bumpers = await prisma.bumper.findMany();
  return new Response(JSON.stringify(bumpers));
};
*/
