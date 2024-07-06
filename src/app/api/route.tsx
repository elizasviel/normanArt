import { Bumper } from "@prisma/client";
import prisma from "../../lib/prisma";

/*
const testBumper: Bumper = {
  id: 1,
  args: [1, 2, 3],
  position: [1, 2, 3],
  color: "red",
};
*/

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
  const res = await request.json();

  const bumper = await prisma.bumper.create({
    data: {
      args: res.args, //somehow rounds to zero
      position: res.position,
      color: res.color,
    },
  });

  return new Response("POST Request recieved");
};

export type BumperResponse = Bumper;

/*

Why alias Bumper?

The same as 
export type {Bumper};

export const GET = async (request: Request) => {
  const bumpers = await prisma.bumper.findMany();
  return new Response(JSON.stringify(bumpers));
};
*/
