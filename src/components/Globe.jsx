import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function GlobeMesh() {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.1;
  });

  return (
    <Sphere args={[1, 64, 64]} ref={meshRef}>
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#1e3a8a"
        emissiveIntensity={0.5}
        wireframe
        transparent
        opacity={0.3}
      />
    </Sphere>
  );
}

export default function Globe() {
  return (
    <div className="absolute inset-0 z-0 opacity-40">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <GlobeMesh />
        </Float>
      </Canvas>
    </div>
  );
}
