import { Button, MermaidDisplay, Sidebar } from '@/components';
import { ClassDisplay } from '@/components/Class';
import { useAxios } from '@/hooks/use-axios';
import {
  Class,
  Property,
  TypeOrRelation,
  type Workspace,
} from '@prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

interface ClassFormValues {
  name: string;
  description?: string;
}

export default function Workspace({
  workspaceId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const axios = useAxios();
  const queryClient = useQueryClient();

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
      (Class & {
        properties: (Property & { propertyTypeRelation: TypeOrRelation })[];
      })[]
    >(`/workspaces/${workspaceId}/classes`);
    return data;
  });

  const createClassMutation = useMutation(
    async (_class: ClassFormValues) => {
      await axios.post<Class>('/classes', {
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
      <div className="flex-grow h-screen p-10 overflow-auto scrollbar-hide">
        <h1 className="text-4xl font-medium">Classes</h1>
        {classes &&
          classes.map((c) => (
            <ClassDisplay
              properties={c.properties}
              name={c.name}
              description={c.description}
              id={c.id}
              key={c.id}
            />
          ))}
        <Button
          text="Add Class"
          type="add"
          onClick={() => setIsClassCreationProcess(true)}
        />
        {isClassCreationProcess && (
          <div className="my-4">
            <input
              type="text"
              className="block text-2xl font-semibold bg-transparent outline-none"
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
              className="text-sm bg-transparent outline-none"
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
      </div>
      <div className="flex-grow max-w-2xl py-10 ml-10">
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
