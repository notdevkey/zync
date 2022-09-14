import {
  ArrowLongDownIcon,
  BoltIcon,
  ChartBarIcon,
  CommandLineIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { Canvas, useFrame } from '@react-three/fiber';
import { ZyncBlob } from 'public/models/zync-blob';
import { ReactElement, Suspense } from 'react';
import * as THREE from 'three';

export function Index() {
  return (
    <div>
      <div className="flex flex-col justify-center h-screen">
        <div className="absolute top-0 left-0 w-screen h-screen isolate">
          <Canvas camera={{ fov: 50 }}>
            <ambientLight intensity={0.1} />
            <pointLight color="red" position={[0, 10, 10]} />
            <Suspense fallback={null}>
              <ZyncBlob />
              <Rig />
            </Suspense>
          </Canvas>
        </div>
        <div className="mb-10 isolate">
          <h1 className="mb-6 text-6xl font-medium text-white font-clash-display">
            Ultimate type safety, <br /> synced all across your application.
          </h1>
          <p className="w-1/2 text-gray-600 font-inter">
            Zync is the tool for perfectionists with deadlines. It deals with
            persisting shared data troughout an application and finally fixes
            all your type safety insecurities.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between isolate">
          <div className="grid max-w-lg grid-cols-2 my-16 gap-x-8 justify-self-center">
            <Icon icon={<CommandLineIcon />} text={'Language-agnostic'} />
            <Icon icon={<ChartBarIcon />} text={'Analytical'} />
            <Icon icon={<HeartIcon />} text={'Open Source'} />
            <Icon icon={<BoltIcon />} text={'Blazingly Fast'} />
          </div>
          <div>
            <h4 className="mb-2 text-3xl font-medium text-white">
              Interested?
            </h4>
            <p className="mb-8 text-blue-100 font-inter">
              Leave your email, it helps us understand how important it is to
              you.
            </p>
            <div className="relative w-fit">
              <input
                type="text"
                placeholder="Email"
                className="h-12 px-4 text-sm text-white placeholder-blue-100 duration-200 bg-blue-200 border border-transparent rounded-md outline-none focus:border-white pr-28"
              />
              <button className="absolute right-1 z-20 -translate-y-1/2 top-1/2 bg-blue-100-opacity-0.05 hover:bg-blue-100-opacity-0.1 text-blue-100 hover:text-white duration-200 h-10 text-sm px-4 rounded-md">
                Sign Up
              </button>
            </div>
          </div>
        </div>
        <div className="absolute flex flex-col items-center self-start bottom-20">
          <p className="text-sm text-blue-100 font-inter">Read more</p>
          <ArrowLongDownIcon className="w-6 h-10 text-blue-100" />
        </div>
      </div>
    </div>
  );
}

function Icon({ icon, text }: { icon: ReactElement; text: string }) {
  return (
    <div className="flex items-center my-3 group">
      <div className="w-6 mr-2 text-white duration-200 group-hover:text-pink-400">
        {icon}
      </div>
      <p className="text-white font-inter">{text}</p>
    </div>
  );
}

function Rig({ v = new THREE.Vector3() }) {
  return useFrame((state) => {
    state.camera.position.lerp(
      v.set(state.mouse.x / 2, state.mouse.y / 2, 10),
      0.05,
    );
  });
}

export default Index;
