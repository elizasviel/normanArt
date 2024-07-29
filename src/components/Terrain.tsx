import React, { useMemo } from "react";
import { RigidBody } from "@react-three/rapier";
import * as Three from "three";
import { createNoise2D } from "simplex-noise";

const wallSize = 100;
const wallThickness = 1;

const Cloud: React.FC<{ position: [number, number, number] }> = ({
  position,
}) => {
  const geometry = useMemo(() => new Three.SphereGeometry(3, 16, 16), []);
  const material = useMemo(
    () =>
      new Three.MeshStandardMaterial({
        color: "white",
        transparent: true,
        opacity: 0.8,
      }),
    []
  );

  return (
    <group position={position}>
      <mesh
        geometry={geometry}
        material={material}
        position={[0, 0, 0]}
        scale={[2, 1, 1]}
      />
      <mesh
        geometry={geometry}
        material={material}
        position={[1, 0.5, 0]}
        scale={[1.5, 0.8, 0.8]}
      />
      <mesh
        geometry={geometry}
        material={material}
        position={[-1, 0.3, 0]}
        scale={[1.7, 0.9, 0.9]}
      />
    </group>
  );
};

export const Terrain: React.FC = () => {
  const geometry = useMemo(() => {
    const noise2D = createNoise2D();
    const size = 128; // Increased resolution
    const width = 100; // Increased width
    const depth = 100; // Increased depth
    const maxHeight = 20; // Increased max height

    const plane = new Three.PlaneGeometry(width, depth, size, size);
    const { array } = plane.attributes.position;

    for (let i = 0; i < array.length; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      // Multiple layers of noise for more interesting terrain
      const noise =
        noise2D(x * 0.01, y * 0.01) +
        0.5 * noise2D(x * 0.05, y * 0.05) +
        0.25 * noise2D(x * 0.1, y * 0.1);
      array[i + 2] = (noise + 1) * 0.5 * maxHeight; // Normalize and scale
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
          position={[0, -10, 0]}
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
