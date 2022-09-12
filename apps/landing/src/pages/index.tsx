import { Navbar, ZyncBlob } from '@/components';
import {
  BoltIcon,
  ChartBarIcon,
  CommandLineIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { Canvas } from '@react-three/fiber';
import { ReactElement } from 'react';

export function Index() {
  return (
    <div>
      <Navbar />
      <Canvas>
        <pointLight position={[0, 10, 0]} intensity={10} color={'#fff'} />
        <ZyncBlob />
      </Canvas>
      <div>
        <h1 className="text-6xl font-medium text-white font-clash-display">
          Ultimate type safety, <br /> synced all across your application.
        </h1>
        <p className="text-gray-600 font-inter">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem quisque
          nunc tristique eget magna.
        </p>
      </div>
      <div className="grid grid-cols-2 my-6">
        <Icon icon={<CommandLineIcon />} text={'Language-agnostic'} />
        <Icon icon={<ChartBarIcon />} text={'Analytical'} />
        <Icon icon={<HeartIcon />} text={'Open Source'} />
        <Icon icon={<BoltIcon />} text={'Blazingly Fast'} />
      </div>
    </div>
  );
}

function Icon({ icon, text }: { icon: ReactElement; text: string }) {
  return (
    <div className="flex items-center my-2">
      <div className="w-6 mr-2 text-white">{icon}</div>
      <p className="text-white font-inter">{text}</p>
    </div>
  );
}

export default Index;
