import {
  MagnifyingGlassIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

interface Props {
  workspaceName: string;
}

export function Sidebar({ workspaceName }: Props) {
  return (
    <div className="h-screen p-6 w-[270px] bg-dark-300">
      <h6 className="text-xs font-medium uppercase text-dark-100 font-dm-sans text text-dark">
        Workspace
      </h6>
      <h2 className="mb-5 text-2xl font-medium">{workspaceName}</h2>
      <div className="relative mb-5 w-max">
        <MagnifyingGlassIcon className="absolute w-5 -translate-y-1/2 text-dark-100 top-1/2 left-3" />
        <input
          type="text"
          placeholder="Search"
          className="h-10 p-2 pl-10 text-sm rounded-lg font-dm-sans bg-dark-200 placeholder:text-dark-100"
        />
      </div>
      <div className="flex items-center h-10 gap-2 p-2 text-sm duration-200 rounded-lg cursor-pointer text-dark-100 hover:bg-dark-200">
        <Squares2X2Icon className="w-6" />
        <h6 className="font-medium font-dm-sans">Dashboard</h6>
      </div>
    </div>
  );
}
