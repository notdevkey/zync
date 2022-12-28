import { useAxios } from '@/hooks/use-axios';
import { formatPropertyType } from '@/utils/format-property';
import { Switch } from '@headlessui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import { Class, Property, PropertyType, TypeOrRelation } from '@prisma/client';
import { useRouter } from 'next/router';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Button } from '../Button';
import { RelationSelect } from './relation-select';

interface PropertyFormValues {
  name: string;
  propertyType: PropertyType;
  description?: string;
}

const DEFAULT_PROP_VALUES: PropertyFormValues = {
  name: '',
  propertyType: PropertyType.STRING,
};

export function ClassDisplay({
  id,
  name,
  description,
  properties,
}: Omit<Class, 'createdAt' | 'updatedAt' | 'workspaceId'> & {
  properties: (Property & { propertyTypeRelation: TypeOrRelation })[];
}) {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const workspaceId = useRouter().query.id as string;

  const { data: classes } = useQuery(['classes'], async () => {
    const { data } = await axios.get<
      (Class & {
        properties: (Property & { propertyTypeRelation: TypeOrRelation })[];
      })[]
    >(`/workspaces/${workspaceId}/classes`);
    return data;
  });

  // Used to track the class which a property is getting assigned to
  const [isCreateMode, setCreateMode] = useState<boolean>(false);

  // Stores the form data for property creation (TODO: validation)
  const [propertyData, setPropertyData] =
    useState<PropertyFormValues>(DEFAULT_PROP_VALUES);

  // Classes to show in types dropdown as relations to other classes
  const listboxClasses = useMemo(() => {
    // Exclude current class
    return classes?.filter((c) => c.id !== id);
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

  const addPropertyMutation = useMutation(
    async (newProperty: Partial<Property> & { propertyType: PropertyType }) => {
      await axios.post<Property>(
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

  const onDeleteClass = useCallback(
    (id: string) => {
      deleteClassMutation.mutate(id);
    },
    [deleteClassMutation],
  );

  // Submits property
  const onSubmitProperty = useCallback(() => {
    const { name, propertyType, description } = propertyData;
    if (!name || !propertyType || !description) return;
    addPropertyMutation.mutate({
      name,
      description,
      propertyType,
      classId: id,
      isRequired: false,
    });
  }, [addPropertyMutation, id, propertyData]);

  // Deletes property
  const onDeleteProperty = useCallback(
    (id: string) => {
      deletePropertyMutation.mutate(id);
    },
    [deletePropertyMutation],
  );

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

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        if (isCreateMode) {
          onSubmitProperty();
        }
        setCreateMode(false);
        setPropertyData(DEFAULT_PROP_VALUES);
      } else if (e.key === 'Escape') {
        setCreateMode(false);
        setPropertyData(DEFAULT_PROP_VALUES);
      }
    }
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [isCreateMode, onSubmitProperty]);

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
          onClick={() => onDeleteClass(id)}
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
              <tr
                key={p.id}
                className="relative border-b border-darkblue-200 group"
              >
                <td className="p-3 border-r border-darkblue-200">
                  <p className="text-white">{p.name}</p>
                </td>
                <td className="p-3 border-r border-darkblue-200">
                  <div
                    className={`rounded-md py-0.5 px-3 font-medium bg-orange-300/[0.1] w-fit  text-orange-300 ${
                      p.propertyTypeRelation.type === PropertyType.STRING &&
                      'bg-orange-300/[0.1] text-orange-300'
                    } ${
                      p.propertyTypeRelation.type === PropertyType.INTEGER &&
                      'bg-cyan-300/[0.1] text-cyan-300'
                    } ${
                      p.propertyTypeRelation.type === PropertyType.DATE_TIME &&
                      'bg-green-300/[0.1] text-green-300'
                    } ${
                      p.propertyTypeRelation.type === PropertyType.FOREIGN &&
                      'bg-violet-300/[0.1] text-violet-300'
                    }`}
                  >
                    {formatPropertyType(
                      p.propertyTypeRelation.type !== PropertyType.FOREIGN
                        ? p.propertyTypeRelation.type
                        : p.propertyTypeRelation.name ?? '',
                    )}
                  </div>
                </td>
                <td className="p-3 border-r border-darkblue-200">
                  <Switch
                    checked={!!p.isRequired}
                    className={`${
                      p.isRequired ? 'bg-blue-100' : 'bg-darkblue-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Enable notifications</span>
                    <span
                      className={`${
                        p.isRequired ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-darkblue-100 transition`}
                    />
                  </Switch>
                  {p.isRequired}
                </td>
                <td className="p-3">
                  <p className="text-white">{p.description}</p>
                </td>
                <td className="absolute right-0 hidden -translate-y-1/2 top-1/2 group-hover:block">
                  <Button
                    type="remove"
                    text="Remove"
                    onClick={() => onDeleteProperty(p.id)}
                  />
                </td>
              </tr>
            ))}
            {isCreateMode && (
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
                    foreign={listboxClasses}
                    onChange={(type: PropertyType) =>
                      setPropertyData((prevData) => ({
                        ...prevData,
                        propertyType: type,
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
                    value={propertyData.description}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {!isCreateMode && (
          <div className="mt-5">
            <Button
              text="Add Property"
              type="add"
              onClick={() => setCreateMode(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
