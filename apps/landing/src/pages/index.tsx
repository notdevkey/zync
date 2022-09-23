import {
  ArrowLongDownIcon,
  BoltIcon,
  ChartBarIcon,
  CommandLineIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { useFrame } from '@react-three/fiber';
import axios from 'axios';
import { ReactElement, useState } from 'react';
import { useMutation } from 'react-query';
import * as THREE from 'three';

export function Index() {
  const [email, setEmail] = useState<string>('');
  const subscribeMutation = useMutation((email: string) => {
    console.log(process.env.MONGODB_URI, process.env.NEXT_PUBLIC_MONGODB_URI);
    return axios.post<null, { email: string }>('/api/subscribe', {
      email,
    });
  });

  return (
    <div>
      <div className="flex flex-col justify-center h-screen">
        <div className="absolute top-0 left-0 w-screen h-screen isolate">
          {/* <Canvas camera={{ fov: 50 }}>
            <ambientLight intensity={0.1} />
            <pointLight color="red" position={[0, 10, 10]} />
            <Suspense fallback={null}>
              <ZyncBlob />
              <Rig />
            </Suspense>
          </Canvas> */}
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
            <div className="flex items-center justify-between bg-blue-200 border border-transparent rounded-md focus:border-white">
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                className="h-full pl-4 text-sm text-white placeholder-blue-100 duration-200 bg-transparent outline-none"
              />
              <button
                onClick={() => subscribeMutation.mutate(email)}
                className="px-6 py-2 m-2 text-sm text-white duration-200 bg-blue-700 rounded-md hover:bg-blue-800 hover:text-white"
              >
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
