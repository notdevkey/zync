import {
  ArrowLongDownIcon,
  BoltIcon,
  ChartBarIcon,
  CommandLineIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { Canvas, useFrame } from '@react-three/fiber';
import axios from 'axios';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ZyncBlob } from 'public/models/zync-blob';
import { ReactElement, Suspense, useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import * as THREE from 'three';

const titleFade = {
  initial: {
    y: 50,
    opacity: 0,
  },
  animate: {
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export function Index() {
  const [email, setEmail] = useState<string>('');
  const [isCommandCopied, setIsCommandCopied] = useState(false);
  const subscribeMutation = useMutation((email: string) => {
    console.log(process.env.MONGODB_URI, process.env.NEXT_PUBLIC_MONGODB_URI);
    return axios.post<null, { email: string }>('/api/subscribe', {
      email,
    });
  });

  const copyNpmCommandToClipboard = useCallback(() => {
    navigator.clipboard.writeText('npm install -g @zyncli/zync');
    setIsCommandCopied(true);
    setTimeout(() => setIsCommandCopied(false), 2000);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="absolute -z-10 w-[500px] h-[500px] bg-[#0c4d9c] blur-[200px] top-1/3 left-1/3" />
        <div className="absolute -z-10 w-[360px] h-[360px] bg-[#BD4BC2] blur-[200px] top-1/2 left-1/2" />
        <div className="absolute top-0 left-0 w-screen h-screen isolate">
          <Canvas camera={{ fov: 50 }}>
            {/* <ambientLight  intensity={0.1} /> */}
            <pointLight position={[0, 10, 10]} />
            <Suspense fallback={null}>
              <ZyncBlob />
              <Rig />
            </Suspense>
          </Canvas>
        </div>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              delay: 1,
              duration: 0.5,
              ease: 'easeOut',
            },
          }}
        >
          <motion.h1
            variants={titleFade}
            className="mb-6 text-5xl font-medium text-center text-white"
          >
            Ultimate type safety, <br /> synced all across your <br />
            application.
          </motion.h1>
          <motion.p
            variants={titleFade}
            className="mb-6 text-center text-[#BABDC0] font-dm-sans font-medium mix-blend-color-dodge max-w-3xl"
          >
            Zync is the tool for perfectionists with deadlines. It deals with
            persisting shared data troughout an application and finally fixes
            all your type safety insecurities.
          </motion.p>
        </motion.div>
        <div className="z-10 grid max-w-lg grid-cols-2 mb-6 gap-x-8 justify-self-center">
          <Icon icon={<CommandLineIcon />} text={'Language-agnostic'} />
          <Icon icon={<ChartBarIcon />} text={'Analytical'} />
          <Icon icon={<HeartIcon />} text={'Open Source'} />
          <Icon icon={<BoltIcon />} text={'Blazingly Fast'} />
        </div>
        <div className="relative border w-[500px] border-white/[0.2] max-w-6xl rounded-xl">
          <Image
            className="overflow-hidden mix-blend-color-dodge"
            src="/svg/snippet-bash.svg"
            alt="Bash script"
            width={1744}
            height={916}
            layout="responsive"
          />
          <div className="absolute bottom-0 flex items-center gap-4 p-3 pl-5 -translate-x-1/2 translate-y-1/2 border shadow-lg left-1/2 w-fit border-darkblue-200 rounded-xl bg-darkblue-300">
            <SyntaxHighlighter
              language="bash"
              style={a11yDark}
              customStyle={{
                background: 'transparent',
                padding: 0,
                margin: 0,
              }}
            >
              npm install @zyncli/zync
            </SyntaxHighlighter>

            {/* <Tooltip
              content={isCommandCopied ? 'Copied!' : 'Copy'}
              placement="top"
              nonce={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            >
              <button
                onClick={copyNpmCommandToClipboard}
                className="p-2 cursor-pointer hover:bg-white/[0.1] duration-100 rounded-xl flex items-center justify-center"
              >
                <ClipboardIcon className="w-6 text-white" />
              </button>
            </Tooltip> */}
          </div>
        </div>
        {/* <div>
          <h4 className="mb-2 text-3xl font-medium text-white">Interested?</h4>
          <p className="mb-8 text-blue-100 font-inter">
            Leave your email, it helps us understand how important it is to you.
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
        </div> */}
        <div className="absolute flex flex-col items-center text-white bottom-10">
          <p className="text-sm font-dm-sans">Read more</p>
          <ArrowLongDownIcon className="w-6 h-10" />
        </div>
      </div>
      <div>
        <h1 className="text-5xl font-medium text-center text-white">
          It takes 2 steps
        </h1>
      </div>
    </>
  );
}

function Icon({ icon, text }: { icon: ReactElement; text: string }) {
  return (
    <div className="flex items-center my-3 group">
      <div className="w-6 mr-2 text-white duration-200 group-hover:text-pink-400">
        {icon}
      </div>
      <p className="font-medium text-white font-dm-sans">{text}</p>
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
