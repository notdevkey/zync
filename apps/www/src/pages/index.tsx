import { trpc } from '@/utils/trpc';

export function Index() {
  const { data: classes } = trpc.useQuery(['healthz']);
  console.log(classes);

  return (
    <div>
      <h1 className="text-4xl font-bold">Add classes</h1>
    </div>
  );
}

export default Index;
