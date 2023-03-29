import { Class, MermaidDisplay, Sidebar } from '@/components';
import { useAxios } from '@/hooks/use-axios';
import { PlusIcon } from '@heroicons/react/20/solid';
import {
  Class as IClass,
  Property,
  TypeOrRelation,
  type Workspace,
} from '@prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { MoonLoader } from 'react-spinners';

interface ClassFormValues {
  name: string;
  description?: string;
}

enum Tabs {
  Classes,
  Enums,
  Consts,
}

export default function Workspace({
  workspaceId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.Classes);

  const [classData, setClassData] = useState<ClassFormValues>({
    name: '',
    description: '',
  });
  const [isClassCreationProcess, setIsClassCreationProcess] =
    useState<boolean>(false);

  const { data: workspace } = useQuery(['workspace'], async () => {
    const { data } = await axios.get<Workspace>(`/workspaces/${workspaceId}`);
    return data;
  });

  const { data: classes } = useQuery(['classes'], async () => {
    const { data } = await axios.get<
      (IClass & {
        properties: (Property & { propertyTypeRelation: TypeOrRelation })[];
      })[]
    >(`/workspaces/${workspaceId}/classes`);
    return data;
  });

  const createClassMutation = useMutation(
    async (_class: ClassFormValues) => {
      await axios.post<IClass>('/classes', {
        name: classData.name,
        description: classData.description,
        workspaceId,
      });
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['classes'] });
      },
    },
  );
  const onCreateClass = useCallback(() => {
    createClassMutation.mutate(classData);
  }, [classData, createClassMutation]);

  // Listens on key events (for better UX)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        if (isClassCreationProcess) {
          onCreateClass();
        }
        setIsClassCreationProcess(false);
      } else if (e.key === 'Escape') {
        setIsClassCreationProcess(false);
      }
    }

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [isClassCreationProcess, onCreateClass]);

  return (
    <div className="flex">
      <Sidebar workspaceName={workspace?.name ?? ''} />
      <div className="relative flex-grow w-1/2 h-screen overflow-auto border-r flex-2 scrollbar-hide border-darkblue-300">
        <div className="border-b border-darkblue-300">
          <div className="p-10 pb-0">
            <h1 className="mb-10 text-4xl font-medium">Dashboard</h1>
            <ul className="flex font-medium list-none font-dm-sans">
              <li
                onClick={() => setSelectedTab(Tabs.Classes)}
                className={`flex items-center gap-3 px-5 py-3 border-b cursor-pointer ${
                  selectedTab === Tabs.Classes
                    ? 'border-blue-100'
                    : 'border-darkblue-300'
                }`}
              >
                Classes
                <div className="flex items-center justify-center w-6 h-6 text-sm rounded-md bg-darkblue-200">
                  {classes?.length}
                </div>
              </li>
              <li
                onClick={() => setSelectedTab(Tabs.Enums)}
                className={`flex items-center gap-3 px-5 py-3 border-b cursor-pointer ${
                  selectedTab === Tabs.Enums
                    ? 'border-blue-100'
                    : 'border-darkblue-300'
                }`}
              >
                Enums
              </li>
              <li
                onClick={() => setSelectedTab(Tabs.Consts)}
                className={`flex items-center gap-3 px-5 py-3 border-b cursor-pointer ${
                  selectedTab === Tabs.Consts
                    ? 'border-blue-100'
                    : 'border-darkblue-300'
                }`}
              >
                Consts
              </li>
            </ul>
          </div>
        </div>
        {selectedTab === Tabs.Classes && (
          <div className="flex flex-col gap-10 p-10">
            {classes &&
              classes.map((c) => (
                <Class
                  properties={c.properties}
                  name={c.name}
                  description={c.description}
                  id={c.id}
                  key={c.id}
                />
              ))}
            {isClassCreationProcess && (
              <div className="my-4">
                <input
                  type="text"
                  className="block text-2xl font-medium text-white bg-transparent outline-none placeholder:text-darkblue-100"
                  placeholder="Name"
                  autoFocus
                  onChange={(e) =>
                    setClassData((prevProps) => ({
                      ...prevProps,
                      name: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  className="text-sm font-medium text-white bg-transparent outline-none font-dm-sans placeholder:text-darkblue-100"
                  placeholder="Description"
                  onChange={(e) =>
                    setClassData((prevProps) => ({
                      ...prevProps,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            )}
            {createClassMutation.isLoading && (
              <MoonLoader
                className="mx-auto"
                color="#72798E"
                loading
                size={50}
              />
            )}
          </div>
        )}
        <div
          onClick={() => setIsClassCreationProcess(true)}
          className="fixed w-fit flex items-center group justify-center p-4 cursor-pointer hover:bg-blue-accent/[0.75] duration-200 rounded-full left-[310px] bottom-10 bg-blue-100"
        >
          <PlusIcon className="w-6 text-white duration-200 group-hover:rotate-90" />
        </div>
      </div>
      <div className="flex-grow hidden w-1/3 py-10 ml-10 flex-4 xl:block">
        <MermaidDisplay workspaceId={workspaceId} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  workspaceId: string;
}> = async (context) => {
  return { props: { workspaceId: context.query.id as string } };
};
