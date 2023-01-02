import { useAxios } from '@/hooks/use-axios';
import { Property as IProperty, PropertyType } from '@prisma/client';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { RelationSelect } from '../Property/relation-select';

interface Props {
  foreignTypes?: string[];
  classId: string;
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

export function PropertyCreate({ foreignTypes, classId }: Props) {
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
    const { name, propertyType, description } = propertyData;
    if (!name || !propertyType || !description) return;
    addPropertyMutation.mutate({
      name,
      description,
      classId,
      propertyType: propertyType,
      isRequired: false,
    });
  }, [addPropertyMutation, classId, propertyData]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Enter') {
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
  }, [onSubmitProperty]);

  return (
    <tr className="relative border-b border-darkblue-200 group">
      <td className="p-3 border-r border-darkblue-200">
        <input
          type="text"
          className="bg-transparent outline-none placeholder:text-darkblue-100 w-fit"
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
      <td className="p-3">
        <input
          type="text"
          className="bg-transparent outline-none placeholder:text-darkblue-100 w-fit"
          autoFocus
          placeholder="Description"
          name="description"
          onChange={onChange}
          value={propertyData.description as string}
        />
      </td>
    </tr>
  );
}
