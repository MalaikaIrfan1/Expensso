import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, RoundedBox, Sparkles, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

function FitCameraToContent({ contentRef }) {
  const { camera, size } = useThree();
  const frameCount = useRef(0);

  // reset the fit whenever the container size changes (resize, rotate, etc.)
  useEffect(() => {
    frameCount.current = 0;
  }, [size.width, size.height]);

  useFrame(() => {
    if (frameCount.current > 5) return; // already fitted for this size
    frameCount.current += 1;
    if (frameCount.current !== 5) return; // wait a few frames so things settle
    if (!contentRef.current) return;

    const box = new THREE.Box3().setFromObject(contentRef.current);
    const boxCenter = new THREE.Vector3();
    const boxSize = new THREE.Vector3();
    box.getCenter(boxCenter);
    box.getSize(boxSize);

    const aspect = size.width / size.height;
    const fov = 45;
    const vFov = (fov * Math.PI) / 180;
    const padding = 1.3; // extra breathing room around the content

    const distForHeight = (boxSize.y * padding) / (2 * Math.tan(vFov / 2));
    const distForWidth = (boxSize.x * padding) / (2 * Math.tan(vFov / 2) * aspect);
    const distance = Math.max(distForHeight, distForWidth);

    camera.fov = fov;
    camera.position.set(boxCenter.x, boxCenter.y, boxCenter.z + distance);
    camera.lookAt(boxCenter);
    camera.updateProjectionMatrix();
  });

  return null;
}

function Coin({ position, color, scale = 1 }) {
  const ref = useRef();
  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.7;
  });
  return (
    <Float speed={1.6} floatIntensity={1.5} rotationIntensity={0.3}>
      <group ref={ref} position={position} scale={scale} rotation={[Math.PI / 2.3, 0, 0]}>
        {/* Coin body */}
        <mesh>
          <cylinderGeometry args={[1, 1, 0.2, 80]} />
          <meshPhysicalMaterial color={color} metalness={0.9} roughness={0.25} clearcoat={0.6} clearcoatRoughness={0.2} />
        </mesh>
        {/* Rim front */}
        <mesh position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.09, 16, 80]} />
          <meshPhysicalMaterial color={color} metalness={0.95} roughness={0.2} clearcoat={0.7} />
        </mesh>
        {/* Rim back */}
        <mesh position={[0, -0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.09, 16, 80]} />
          <meshPhysicalMaterial color={color} metalness={0.95} roughness={0.2} clearcoat={0.7} />
        </mesh>
        {/* Inner emblem disc */}
        <mesh position={[0, 0.13, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.04, 80]} />
          <meshPhysicalMaterial color={color} metalness={0.7} roughness={0.4} clearcoat={0.4} />
        </mesh>
        {/* Dollar sign emblem */}
        <Text
          position={[0, 0.17, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.55}
          color="#3a2a10"
          anchorX="center"
          anchorY="middle"
        >
          $
        </Text>
      </group>
    </Float>
  );
}

function Card() {
  return (
    <Float speed={1.2} floatIntensity={1.2} rotationIntensity={0.5}>
      <group rotation={[0.15, -0.35, 0.05]}>
        {/* Card base */}
        <RoundedBox args={[2.6, 1.6, 0.1]} radius={0.14} smoothness={4}>
          <meshPhysicalMaterial color="#1E3A8A" metalness={0.55} roughness={0.3} clearcoat={0.8} clearcoatRoughness={0.15} />
        </RoundedBox>
        {/* Gradient accent stripe */}
        <mesh position={[0, -0.5, 0.056]}>
          <planeGeometry args={[2.6, 0.35]} />
          <meshStandardMaterial color="#FF7A45" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Chip */}
        <mesh position={[-0.85, 0.35, 0.06]}>
          <boxGeometry args={[0.38, 0.28, 0.03]} />
          <meshPhysicalMaterial color="#FFD27A" metalness={0.9} roughness={0.25} clearcoat={0.6} />
        </mesh>
        {/* Chip inner lines */}
        <mesh position={[-0.85, 0.35, 0.076]}>
          <boxGeometry args={[0.28, 0.02, 0.005]} />
          <meshStandardMaterial color="#8a6a2a" />
        </mesh>
        <mesh position={[-0.85, 0.28, 0.076]}>
          <boxGeometry args={[0.28, 0.02, 0.005]} />
          <meshStandardMaterial color="#8a6a2a" />
        </mesh>
        {/* Card number dots */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-0.9 + i * 0.55, -0.05, 0.06]}>
            <boxGeometry args={[0.35, 0.09, 0.01]} />
            <meshStandardMaterial color="#ffffff" opacity={0.85} transparent />
          </mesh>
        ))}
        {/* Logo circles top-right */}
        <mesh position={[0.85, 0.5, 0.06]}>
          <circleGeometry args={[0.16, 32]} />
          <meshStandardMaterial color="#FF7A45" opacity={0.9} transparent />
        </mesh>
        <mesh position={[1.02, 0.5, 0.055]}>
          <circleGeometry args={[0.16, 32]} />
          <meshStandardMaterial color="#FFD27A" opacity={0.75} transparent />
        </mesh>
      </group>
    </Float>
  );
}

function Bars() {
  const group = useRef();
  const heights = [0.6, 1.1, 0.8, 1.4, 0.9];
  useFrame((state) => {
    group.current.children.forEach((bar, i) => {
      const t = state.clock.elapsedTime;
      const h = heights[i] + Math.sin(t * 1.2 + i) * 0.25;
      bar.scale.y = h;
      bar.position.y = h / 2 - 0.9;
    });
  });

  return (
    <group ref={group} position={[1.9, -1.2, -0.6]}>
      {heights.map((h, i) => (
        <mesh key={i} position={[i * 0.35, h / 2, 0]}>
          <boxGeometry args={[0.25, 1, 0.25]} />
          <meshPhysicalMaterial color={i % 2 === 0 ? '#FF7A45' : '#3B82F6'} metalness={0.4} roughness={0.3} clearcoat={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene() {
  const contentRef = useRef();

  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
      <FitCameraToContent contentRef={contentRef} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 4, 4]} intensity={1.4} />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#3B82F6" />
      <pointLight position={[-3, -2, 2]} intensity={0.4} color="#FFB088" />
      <Environment preset="city" />
      <Sparkles count={30} scale={6} size={2} speed={0.3} color="#FF7A45" opacity={0.4} />

      <group ref={contentRef}>
        <Card />
        <Coin position={[-2.1, 1.3, 0.5]} color="#FFB020" scale={0.55} />
        <Coin position={[-1.7, 1.9, -0.3]} color="#FF7A45" scale={0.4} />
        <Coin position={[2.1, 1.5, 0.3]} color="#FFB020" scale={0.45} />
        <Bars />
      </group>
    </Canvas>
  );
}