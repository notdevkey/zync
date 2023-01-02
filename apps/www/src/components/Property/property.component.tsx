import { useAxios } from '@/hooks/use-axios';
import { Switch } from '@headlessui/react';
import { Property, PropertyType } from '@prisma/client';
import { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Button } from '../Button';
import { RelationSelect } from './relation-select';
import { TextEntry } from './text-entry';

interface Props {
  id: string;
  name: string;
  description: string | null;
  isRequired: boolean | null;
  selectedType: string;
  foreignClasses?: string[];
}

export function Property({
  id,
  name,
  description,
  foreignClasses,
  selectedType,
  isRequired,
}: Props) {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const updatePropertyMutation = useMutation(
    async (data: Partial<Property & { type: PropertyType }>) => {
      const { id, ...propertyData } = data;
      await axios.put(`/properties/${data.id}`, propertyData);
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['classes'] });
      },
    },
  );

  const onUpdateProperty = useCallback(
    (property: Partial<Property & { type: PropertyType }>) => {
      updatePropertyMutation.mutate({ ...property, id });
    },
    [id, updatePropertyMutation],
  );

  // Handle for deleting property
  const deletePropertyMutation = useMutation(
    async (propertyId: string) => {
      await axios.delete(`/properties/${propertyId}`);
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['classes'] });
      },
    },
  );

  return (
    <tr className="relative border-b border-darkblue-200 group">
      <td className="p-3 border-r border-darkblue-200">
        <TextEntry
          text={name}
          onSubmit={(name) => onUpdateProperty({ name })}
        />
      </td>
      <td className="p-3 border-r border-darkblue-200">
        <RelationSelect
          selectedType={selectedType}
          foreign={foreignClasses}
          onChange={(type: PropertyType) => {
            onUpdateProperty({ type });
          }}
        />
      </td>
      <td className="p-3 border-r border-darkblue-200">
        <Switch
          checked={!!isRequired}
          onChange={(v: boolean) => onUpdateProperty({ isRequired: v })}
          className={`${
            isRequired ? 'bg-blue-100' : 'bg-darkblue-200'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              isRequired
                ? 'translate-x-6 bg-white'
                : 'translate-x-1 bg-darkblue-100'
            } inline-block h-4 w-4 transform rounded-full transition`}
          />
        </Switch>
        {isRequired}
      </td>
      <td className="p-3">
        {description && (
          <TextEntry
            text={description}
            onSubmit={(description) => onUpdateProperty({ description })}
          />
        )}
      </td>
      <td className="absolute right-0 hidden -translate-y-1/2 top-1/2 group-hover:block">
        <Button
          type="remove"
          text="Remove"
          onClick={() => deletePropertyMutation.mutate(id)}
        />
      </td>
    </tr>
  );
}
