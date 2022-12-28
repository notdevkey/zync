import { useAxios } from '@/hooks/use-axios';
import { Workspace } from '@prisma/client';
import Link from 'next/link';
import { useQuery } from 'react-query';

export default function Workspaces() {
  const axios = useAxios();

  const { data: workspaces } = useQuery(['workspaces'], async () => {
    const { data } = await axios.get<Workspace[]>('/workspaces');
    return data;
  });

  return (
    <>
      <h1 className="mb-10 text-3xl font-bold">Workspaces</h1>
      <div>
        {workspaces?.map((workspace) => (
          <Link href={`/workspaces/${workspace.id}`} key={workspace.id}>
            <div className="p-12 duration-200 rounded-lg shadow-lg cursor-pointer bg-darkblue-300 w-fit hover:shadow-xl hover:-translate-y-1">
              <h1 className="font-bold font-inter">{workspace.name}</h1>
              <p className="text-sm font-inter">{workspace.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
