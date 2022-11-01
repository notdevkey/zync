import Link from 'next/link';
import { ReactComponent as ZyncLogo } from '../../../public/svg/zync.svg';

export function Navbar() {
  return (
    <div className="fixed top-0 z-10 grid items-center w-1/2 grid-cols-8 py-8 -translate-x-1/2 left-1/2">
      <div className="flex items-center col-span-2">
        <div className="w-6 mr-4">
          <ZyncLogo />
        </div>
        <h5 className="text-xl text-white">Zync</h5>
      </div>
      <div className="flex items-center justify-between max-w-xs col-span-4">
        <LinkComponent href="/" text="Home" />
        <LinkComponent href="/about-us" text="About Us" />
        <LinkComponent href="/motivation" text="Motivation" />
      </div>
      <button className="col-span-2 rounded-md py-2 text-blue-100 px-6 duration-200 text-sm hover:text-white justify-self-end bg-blue-100-opacity-0.05 hover:bg-blue-100-opacity-0.1 w-fit font-inter font-medium">
        Sign Up
      </button>
    </div>
  );
}

function LinkComponent({ text, href }: { text: string; href: string }) {
  return (
    <div className="text-sm text-blue-100 duration-200 font-md font-inter hover:text-white">
      <Link href={href}>{text}</Link>
    </div>
  );
}
