import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
  return (
    <div className="fixed top-0 grid items-center w-1/2 grid-cols-8 py-8 -translate-x-1/2 left-1/2">
      <div className="flex items-center col-span-2">
        <div className="w-8 mr-4">
          <Image
            src="/png/zync.png"
            width={'100%'}
            height={'100%'}
            objectFit={'cover'}
            alt="Zync logo"
          />
        </div>
        <h5 className="text-xl text-white">Zync</h5>
      </div>
      <div className="flex items-center justify-between max-w-xs col-span-4">
        <LinkComponent href="/" text="Home" />
        <LinkComponent href="/about-us" text="About Us" />
        <LinkComponent href="/motivation" text="Motivation" />
      </div>
      <button className="col-span-2 rounded-md py-2 text-blue-100 px-6 duration-200 text-sm hover:text-white justify-self-end bg-blue-100-opacity-0.05 hover:bg-blue-100-opacity-0.1 w-fit">
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
