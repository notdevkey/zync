import { Button } from '@/components';
import { trpc } from '@/utils/trpc';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import { Type } from '@prisma/client';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

type FormValues = {
  name: string;
  type: Type;
  description: string;
};

export function Index() {
  const ctx = trpc.useContext();

  const [propertyData, setPropertyData] = useState<FormValues>({
    description: '',
    name: '',
    type: 'String',
  });
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  const { data: classes } = trpc.useQuery(['class.all']);

  const addProperty = trpc.useMutation(['class.addProperty'], {
    onSuccess() {
      ctx.invalidateQueries(['class.all']);
    },
  });
  const deleteProperty = trpc.useMutation(['class.deleteProperty'], {
    onSuccess() {
      ctx.invalidateQueries(['class.all']);
    },
  });

  const onSubmit = useCallback(() => {
    const { name, type, description } = propertyData;
    if (!name || !type || !description) return;
    addProperty.mutate({
      name,
      description,
      type,
      classId: selectedClassId,
    });
  }, [addProperty, propertyData, selectedClassId]);

  useEffect(() => {
    function handleEnter(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        onSubmit();
      }
    }

    document.addEventListener('keydown', handleEnter);

    return () => {
      document.removeEventListener('keydown', handleEnter);
    };
  }, [onSubmit]);

  const onDeleteProperty = useCallback(
    (id: string) => {
      deleteProperty.mutate({ id });
    },
    [deleteProperty],
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      console.log(e.target.value);
      setPropertyData((propertyData) => ({
        ...propertyData,
        [e.target.name]: e.target.value,
      }));
    },
    [],
  );

  return (
    <div>
      <h1 className="mb-10 text-4xl font-bold">Classes</h1>
      {classes &&
        classes.map((c) => (
          <div key={c.id} onFocus={() => setSelectedClassId(c.id)}>
            <div className="flex items-center group">
              <div className="mr-5">
                <h4 className="text-2xl font-bold mb">{c.name}</h4>
                <p className="text-sm mb-2">{c.description}</p>
              </div>
              <PencilIcon className="w-6 text-gray-400 hidden group-hover:block" />
            </div>
            <table className="w-full">
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
                  <tr key={p.id} className="relative group">
                    <td className="p-2 text-sm border font-inter border-gray">
                      {p.name}
                    </td>
                    <td className="p-2 text-sm border font-inter border-gray">
                      {p.type}
                    </td>
                    <td className="p-2 text-sm border font-inter border-gray">
                      {p.description}
                    </td>
                    <td className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:block">
                      <Button
                        type="remove"
                        text="Remove"
                        onClick={() => onDeleteProperty(p.id)}
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <input
                      type="text"
                      name="name"
                      onChange={onChange}
                      value={propertyData.name}
                    />
                  </td>
                  <td>
                    <select
                      name="type"
                      value={propertyData.type}
                      defaultValue={propertyData.type}
                      onChange={onChange}
                    >
                      <option value="String">String</option>
                      <option value="Integer">Integer</option>
                      <option value="DateTime">Date Time</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      name="description"
                      onChange={onChange}
                      value={propertyData.description}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}

export default Index;
