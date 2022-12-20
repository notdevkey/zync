import { useAxios } from '@/hooks/use-axios';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import { Class, Property, PropertyType, TypeOrRelation } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import _ from 'lodash';
import { useRouter } from 'next/router';
import {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Button } from '../Button';

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

  const formatPropertyType = useCallback(
    (text: string) => _.startCase(_.toLower(text)),
    [],
  );

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
    <div className="p-5 my-8 rounded-lg bg-dark-300">
      <div className="flex items-center group">
        <div className="flex items-center gap-5">
          <h4 className="text-2xl font-medium mb">{name}</h4>
          <p className="mb-2 text-sm font-medium font-dm-sans text-dark-100">
            {description}
          </p>
        </div>
        <PencilIcon className="hidden w-6 text-gray-400 cursor-pointer group-hover:block hover:text-gray-600" />
        <TrashIcon
          onClick={() => onDeleteClass(id)}
          className="hidden w-6 ml-2 text-gray-400 cursor-pointer group-hover:block hover:text-gray-600"
        />
      </div>
      <div className="text-white border-dark font-dm-sans border-dark-200">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>
                <p className="font-medium text-dark-100">Name</p>
              </TableHeaderCell>
              <TableHeaderCell>
                <p className="font-medium text-dark-100">Type</p>
              </TableHeaderCell>
              <TableHeaderCell>
                <p className="font-medium text-dark-100">Description</p>
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <p className="text-white">{p.name}</p>
                </TableCell>
                <TableCell>
                  <div className="rounded-md py-1 px-3 font-medium bg-orange-300/[0.1] w-fit  text-orange-300">
                    {formatPropertyType(
                      p.propertyTypeRelation.type !== PropertyType.FOREIGN
                        ? p.propertyTypeRelation.type
                        : p.propertyTypeRelation.name ?? '',
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-white">{p.description}</p>
                </TableCell>
                <TableCell>
                  <Button
                    type="remove"
                    text="Remove"
                    onClick={() => onDeleteProperty(p.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {isCreateMode ? (
        <div>
          <input
            type="text"
            className="bg-transparent outline-none"
            autoFocus
            placeholder="Name"
            name="name"
            onChange={onChange}
            value={propertyData.name}
          />
          <Listbox
            value={propertyData.propertyType}
            onChange={(type) =>
              setPropertyData((prevData) => ({
                ...prevData,
                propertyType: type,
              }))
            }
          >
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-pointer focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">
                  {formatPropertyType(propertyData.propertyType)}
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute flex items-center gap-2 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <div>
                    {Object.values(PropertyType)
                      .filter((p) => p !== PropertyType.FOREIGN)
                      .map((propertyType, i) => (
                        <Listbox.Option
                          key={i}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? 'bg-amber-100 text-amber-900'
                                : 'text-gray-900'
                            }`
                          }
                          value={propertyType}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {formatPropertyType(propertyType)}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                  </div>
                  <div className="w-[1px] h-10 bg-gray-200" />
                  <div>
                    {listboxClasses?.map((c) => (
                      <Listbox.Option
                        key={c.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? 'bg-amber-100 text-amber-900'
                              : 'text-gray-900'
                          }`
                        }
                        value={c.name}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {c.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <CheckIcon
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </div>
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
          <input
            type="text"
            name="description"
            onChange={onChange}
            value={propertyData.description}
          />
        </div>
      ) : (
        <Button
          text="Add Property"
          type="add"
          onClick={() => setCreateMode(true)}
        />
      )}
    </div>
  );
}
