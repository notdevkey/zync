import { useAxios } from '@/hooks/use-axios';
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import {
  Class,
  Property as IProperty,
  PropertyType,
  TypeOrRelation,
} from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Button } from '../Button';
import { Property } from '../Property';
import { PropertyCreate } from './property-create';

export function Class({
  id,
  name,
  description,
  properties,
}: Omit<Class, 'createdAt' | 'updatedAt' | 'workspaceId'> & {
  properties: (IProperty & { propertyTypeRelation: TypeOrRelation })[];
}) {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const workspaceId = useRouter().query.id as string;

  const { data: classes } = useQuery(['classes'], async () => {
    const { data } = await axios.get<
      (Class & {
        properties: (IProperty & { propertyTypeRelation: TypeOrRelation })[];
      })[]
    >(`/workspaces/${workspaceId}/classes`);
    return data;
  });

  // Used to track the class which a property is getting assigned to
  const [isCreatingProperty, setIsCreatingProperty] = useState<boolean>(false);

  // Classes to show in types dropdown as relations to other classes
  const foreignTypes = useMemo(() => {
    // Exclude current class
    return classes?.filter((c) => c.id !== id).map((c) => c.name);
  }, [classes, id]);

  const deleteClassMutation = useMutation(
    async (classId: string) => {
      await axios.delete(`/classes/${classId}`);
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['classes'] });
      },
    },
  );

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsCreatingProperty(false);
      }
    }
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [isCreatingProperty]);

  return (
    <div className="p-5 rounded-lg bg-darkblue-300">
      <div className="flex items-center mb-4 group">
        <div className="flex items-center gap-5">
          <h4 className="text-2xl font-medium mb">{name}</h4>
          <p className="mb-2 text-sm font-medium font-dm-sans text-darkblue-100">
            {description}
          </p>
        </div>
        <PencilIcon className="hidden w-6 text-gray-400 cursor-pointer group-hover:block hover:text-gray-600" />
        <TrashIcon
          onClick={() => deleteClassMutation.mutate(id)}
          className="hidden w-6 ml-2 text-gray-400 cursor-pointer group-hover:block hover:text-gray-600"
        />
      </div>
      <div className="text-white font-dm-sans border-darkblue-200">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-t border-b border-darkblue-200">
              <td className="p-3">
                <p className="font-medium text-darkblue-100">Name</p>
              </td>
              <td className="p-3">
                <p className="font-medium text-darkblue-100">Type</p>
              </td>
              <td className="p-3">
                <p className="font-medium text-darkblue-100">Required</p>
              </td>
              <td className="p-3">
                <p className="font-medium text-darkblue-100">Description</p>
              </td>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <Property
                id={p.id}
                name={p.name}
                description={p.description}
                foreignClasses={foreignTypes}
                isRequired={p.isRequired}
                selectedType={
                  p.propertyTypeRelation.type !== PropertyType.FOREIGN
                    ? p.propertyTypeRelation.type
                    : p.propertyTypeRelation.name || ''
                }
                key={p.id}
              />
            ))}
            {isCreatingProperty && (
              <PropertyCreate foreignTypes={foreignTypes} classId={id} />
            )}
          </tbody>
        </table>
        {!isCreatingProperty && (
          <div className="mt-5">
            <Button
              text="Add Property"
              type="add"
              onClick={() => setIsCreatingProperty(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
