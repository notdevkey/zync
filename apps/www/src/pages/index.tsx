import { trpc } from '@/utils/trpc';

export function Index() {
  const { data: classes } = trpc.useQuery(['class.all']);

  return (
    <div>
      <h1 className="mb-10 text-4xl font-bold">Classes</h1>
      {classes &&
        classes.map((c) => (
          <div key={c.id}>
            <h4 className="text-2xl font-bold mb">{c.name}</h4>
            <p className="text-sm">{c.description}</p>
            <table className="w-full mt-3 rounded-md">
              <thead>
                <tr>
                  <td className="p-2 text-sm font-bold border font-inter border-gray">
                    Name
                  </td>
                  <td className="p-2 text-sm font-bold border font-inter border-gray">
                    Type
                  </td>
                  <td className="p-2 text-sm font-bold border font-inter border-gray">
                    Description
                  </td>
                </tr>
              </thead>
              <tbody>
                {c.properties.map((p) => (
                  <tr key={p.id} className="p-2 text-sm bg-white">
                    <td className="p-2 border font-inter border-gray">
                      {p.name}
                    </td>
                    <td className="p-2 border font-inter border-gray">
                      {p.type}
                    </td>
                    <td className="p-2 border font-inter border-gray">
                      {p.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}

export default Index;
