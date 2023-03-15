import { useAxios } from '@/hooks/use-axios';
import { Switch } from '@headlessui/react';
import { Property as IProperty, PropertyType } from '@prisma/client';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { RelationSelect } from '../Property/relation-select';

interface Props {
  foreignTypes?: string[];
  classId: string;
  onSubmit(): void;
}

interface PropertyCreateInput {
  name: string;
  description: string;
  isRequired: boolean;
  classId: string;
  propertyType: PropertyType | string;
}

const DEFAULT_PROP_VALUES: PropertyCreateInput = {
  name: '',
  isRequired: true,
  description: '',
  classId: '',
  propertyType: PropertyType.STRING,
};

export function PropertyCreate({ foreignTypes, classId, onSubmit }: Props) {
  const axios = useAxios();
  const queryClient = useQueryClient();

  // Stores the form data for property creation (TODO: validation)
  const [propertyData, setPropertyData] =
    useState<PropertyCreateInput>(DEFAULT_PROP_VALUES);

  // Stores new property data in state before submission
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setPropertyData((propertyData) => ({
        ...propertyData,
        [e.target.name]: e.target.value,
      }));
    },
    [],
  );

  const addPropertyMutation = useMutation(
    async (newProperty: PropertyCreateInput) => {
      await axios.post<IProperty>(
        `/classes/${newProperty.classId}/properties`,
        newProperty,
      );
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['classes'] });
      },
    },
  );

  // Submits property
  const onSubmitProperty = useCallback(() => {
    const { name, propertyType, description, isRequired } = propertyData;
    if (!name || !propertyType || !description) return;
    addPropertyMutation.mutate({
      name,
      description,
      classId,
      propertyType,
      isRequired,
    });
  }, [addPropertyMutation, classId, propertyData]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        onSubmit();
        onSubmitProperty();
        setPropertyData(DEFAULT_PROP_VALUES);
      } else if (e.key === 'Escape') {
        setPropertyData(DEFAULT_PROP_VALUES);
      }
    }
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [onSubmit, onSubmitProperty]);

  return (
    <tr className="relative border-b border-darkblue-200 group">
      <td className="p-3 border-r border-darkblue-200">
        <input
          type="text"
          className="bg-transparent outline-none placeholder:text-darkblue-100"
          autoFocus
          placeholder="Name"
          name="name"
          onChange={onChange}
          value={propertyData.name}
        />
      </td>
      <td className="p-3 border-r border-darkblue-200">
        <RelationSelect
          selectedType={propertyData.propertyType}
          foreign={foreignTypes}
          onChange={(type: PropertyType) =>
            setPropertyData((prevData) => ({
              ...prevData,
              type,
            }))
          }
        />
      </td>
      <td className="p-3 border-r border-darkblue-200">
        <Switch
          checked={!!propertyData.isRequired}
          onChange={(isRequired: boolean) =>
            setPropertyData((prevData) => ({ ...prevData, isRequired }))
          }
          className={`${
            propertyData.isRequired ? 'bg-blue-100' : 'bg-darkblue-200'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              propertyData.isRequired
                ? 'translate-x-6 bg-white'
                : 'translate-x-1 bg-darkblue-100'
            } inline-block h-4 w-4 transform rounded-full transition`}
          />
        </Switch>
      </td>
      <td className="p-3">
        <input
          type="text"
          className="bg-transparent outline-none placeholder:text-darkblue-100 w-fit"
          placeholder="Description"
          name="description"
          onChange={onChange}
          value={propertyData.description as string}
        />
      </td>
    </tr>
  );
}
