import React, { useMemo } from "react";
import { RigidBody } from "@react-three/rapier";
import * as Three from "three";
import { createNoise2D } from "simplex-noise";
import { Sky } from "@react-three/drei";

const wallSize = 100;
const wallThickness = 2;

const Cloud: React.FC<{ position: [number, number, number] }> = ({
  position,
}) => {
  const geometry = useMemo(() => new Three.SphereGeometry(3, 16, 16), []);
  const material = useMemo(
    () =>
      new Three.MeshStandardMaterial({
        color: "white",
        transparent: false,
      }),
    []
  );

  const scales: [
    [number, number, number],
    [number, number, number],
    [number, number, number]
  ] = useMemo(
    () => [
      [2 * Math.random() + 1, Math.random() + 0.5, Math.random() + 0.5],
      [
        1.5 * Math.random() + 0.5,
        Math.random() * 0.3 + 0.5,
        Math.random() * 0.3 + 0.5,
      ],
      [
        1.7 * Math.random() + 0.7,
        Math.random() * 0.4 + 0.5,
        Math.random() * 0.4 + 0.5,
      ],
    ],
    []
  );

  return (
    <group position={position}>
      <mesh
        geometry={geometry}
        material={material}
        position={[0, 0, 0]}
        scale={scales[0]}
      />
      <mesh
        geometry={geometry}
        material={material}
        position={[1, 0.5, 0]}
        scale={scales[1]}
      />
      <mesh
        geometry={geometry}
        material={material}
        position={[-1, 0.3, 0]}
        scale={scales[2]}
      />
    </group>
  );
};

const Wall: React.FC<{
  position: [number, number, number];
  rotation: [number, number, number];
}> = ({ position, rotation }) => {
  const wallGeometry = useMemo(() => {
    const shape = new Three.Shape();
    shape.moveTo(-wallSize / 2, -wallSize / 2);
    shape.lineTo(wallSize / 2, -wallSize / 2);
    shape.lineTo(wallSize / 2, wallSize / 2);
    shape.lineTo(-wallSize / 2, wallSize / 2);
    shape.closePath();

    const hole = new Three.Path();
    hole.absarc(0, 0, wallSize / 4, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const extrudeSettings = {
      steps: 1,
      depth: wallThickness,
      bevelEnabled: false,
    };

    return new Three.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const wallMaterial = useMemo(
    () => new Three.MeshStandardMaterial({ color: "gray" }),
    []
  );

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh
        geometry={wallGeometry}
        material={wallMaterial}
        position={position}
        rotation={rotation}
      />
    </RigidBody>
  );
};

interface PlateauProps {
  position: [number, number, number];
  size: number;
  height: number;
}

const Plateau: React.FC<PlateauProps> = ({ position, size, height }) => {
  const geometry = useMemo(
    () => new Three.BoxGeometry(size, height, size),
    [size, height]
  );
  const material = useMemo(
    () => new Three.MeshStandardMaterial({ color: "saddlebrown" }),
    []
  );

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh
        geometry={geometry}
        material={material}
        position={[position[0], position[1] + height / 2, position[2]]}
      />
    </RigidBody>
  );
};

export const Terrain: React.FC = () => {
  const geometry = useMemo(() => {
    const noise2D = createNoise2D();
    const size = 128;
    const width = 100;
    const depth = 100;
    const maxHeight = 15;

    const plane = new Three.PlaneGeometry(width, depth, size, size);
    const { array } = plane.attributes.position;

    for (let i = 0; i < array.length; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      const noise =
        noise2D(x * 0.02, y * 0.02) +
        0.5 * noise2D(x * 0.04, y * 0.04) +
        0.25 * noise2D(x * 0.08, y * 0.08);
      array[i + 2] = (noise + 1) * 0.5 * maxHeight;
    }

    plane.computeVertexNormals();
    return plane;
  }, []);

  const material = useMemo(() => {
    return new Three.MeshStandardMaterial({
      vertexColors: true,
      side: Three.DoubleSide,
    });
  }, []);

  useMemo(() => {
    const colors = [];
    const { array } = geometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
      const height = array[i + 2];
      if (height < 5) {
        colors.push(0, 0.5, 0.8); // Water
      } else if (height < 10) {
        colors.push(0.8, 0.7, 0.5); // Sand
      } else if (height < 15) {
        colors.push(0.1, 0.6, 0.1); // Grass
      } else {
        colors.push(0.5, 0.5, 0.5); // Rock
      }
    }
    geometry.setAttribute("color", new Three.Float32BufferAttribute(colors, 3));
  }, [geometry]);

  const clouds = useMemo(() => {
    const cloudPositions = [];
    for (let i = 0; i < 40; i++) {
      cloudPositions.push([
        Math.random() * 100 - 50,
        Math.random() * 10 + 20,
        Math.random() * 100 - 50,
      ] as [number, number, number]);
    }
    return cloudPositions;
  }, []);

  return (
    <>
      <RigidBody type="fixed" colliders="trimesh">
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={geometry}
          material={material}
          position={[0, -20, 0]}
        />
      </RigidBody>
      <RigidBody type="fixed" colliders="trimesh">
        {clouds.map((position, index) => (
          <Cloud key={index} position={position} />
        ))}
      </RigidBody>
    </>
  );
};

/*

<Sky />

      <Wall position={[0, 30, -50]} rotation={[0, 0, 0]} />
      <Wall position={[0, 30, 50]} rotation={[0, Math.PI, 0]} />
      <Wall position={[-50, 30, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Wall position={[50, 30, 0]} rotation={[0, -Math.PI / 2, 0]} />

      <Plateau position={[-30, -10, -30]} size={20} height={15} />
      <Plateau position={[25, -12, 20]} size={25} height={10} />
      <Plateau position={[25, -15, 0]} size={30} height={40} />
*/
