import React, { useRef, Suspense, useEffect } from 'react';
import { useGLTF, useAnimations, Float, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

// High-quality stylized avatar models
const AVATAR_URLS = {
  male: 'https://models.readyplayer.me/648570d10996614749f1db12.glb',
  female: 'https://models.readyplayer.me/648570f80996614749f1db64.glb'
};

function Model({ url }) {
  try {
    const { scene, animations } = useGLTF(url);
    const group = useRef();
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
      if (actions && Object.keys(actions).length > 0) {
        actions[Object.keys(actions)[0]].play();
      }
    }, [actions]);

    return (
      <group ref={group} scale={2} position={[0, -2.5, 0]}>
        <primitive object={scene} />
      </group>
    );
  } catch (error) {
    console.error("Failed to load 3D model, showing fallback:", error);
    return <FallbackModel />;
  }
}

function FallbackModel({ skinColor, hairColor, familyCount, gender }) {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.4, 1, 4, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      {/* Clothing */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      {/* Family members */}
      {Array.from({ length: familyCount }).map((_, idx) => (
        <group key={idx} position={[ (idx + 1) * 1.5, 0, 0]}>
          <Model url={AVATAR_URLS[gender] || AVATAR_URLS.male} />
        </group>
      ))}

      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.4, 1, 4, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
    </group>
  );
}

export default function AvatarRoom({ cityVibe = 'default', gender = 'male', isSimMode = false, currentScene = 'default', characterName = 'User', status = 'online', hairColor = '#000000', skinColor = '#ffe0bd', familyCount = 0, familyTags = '' }) {
  // Define lighting presets based on city vibes and scenes
  const baseThemes = {
    tokyo: { color: '#6366f1', intensity: 2, env: 'city' },
    la: { color: '#f59e0b', intensity: 1.5, env: 'sunset' },
    london: { color: '#94a3b8', intensity: 0.8, env: 'apartment' },
    default: { color: '#3b82f6', intensity: 1.2, env: 'warehouse' }
  };

  const simsScenes = {
    morning: { color: '#fcd34d', intensity: 2, env: 'park' },
    work: { color: '#38bdf8', intensity: 1, env: 'city' },
    night: { color: '#818cf8', intensity: 0.5, env: 'night' },
    default: baseThemes[cityVibe] || baseThemes.default
  };

  const theme = isSimMode ? (simsScenes[currentScene] || simsScenes.default) : (baseThemes[cityVibe] || baseThemes.default);

  return (
    <div className="w-full h-[500px] relative rounded-[3rem] overflow-hidden bg-midnight-900 border border-white/5 shadow-inner">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className={`w-full h-full bg-gradient-to-b from-transparent to-${theme.color}/10`} />
      </div>
      
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }} shadows>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} color={theme.color} intensity={theme.intensity} />
        
        <Suspense fallback={<FallbackModel skinColor={skinColor} hairColor={hairColor} familyCount={familyCount} gender={gender} />}>
          <Model url={AVATAR_URLS[gender] || AVATAR_URLS.male} />
          <Environment preset={theme.env} />
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4} 
          />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 2.2} 
          maxPolarAngle={Math.PI / 2} 
        />
      </Canvas>

      <div className="absolute top-10 left-10 z-10">
         <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
          <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
          <span className="text-[10px] font-display tracking-[0.2em] text-white uppercase">3D Visualization Active</span>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-display tracking-[0.2em] text-white uppercase">Neural Avatar Connected</span>
      </div>
    </div>
  );
}
