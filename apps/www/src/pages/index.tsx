import { Button, MermaidDisplay } from '@/components';
import { trpc } from '@/utils/trpc';
import { Listbox, Transition } from '@headlessui/react';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

type FormValues = {
  name: string;
  type: string;
  description: string;
};

const QUERY_ALL_CLASSES = 'class.all';
const DEFAULT_PROP_VALUES: FormValues = {
  name: '',
  description: '',
  type: 'String',
};

export function Index() {
  const ctx = trpc.useContext();

  // Used to track the class which a property is getting assigned to
  const [idxToCreate, setIdxToCreate] = useState<string>('');

  // Stores the form data for property creation (TODO: validation)
  const [propertyData, setPropertyData] =
    useState<FormValues>(DEFAULT_PROP_VALUES);

  const [classProperties, setClassProperties] = useState({
    name: '',
    description: '',
  });
  const [isClassCreationProcess, setIsClassCreationProcess] =
    useState<boolean>(false);

  // Gets all available classes with properties
  const { data: classes } = trpc.useQuery([QUERY_ALL_CLASSES]);

  // Handle for creating property
  const addProperty = trpc.useMutation(['class.addProperty'], {
    onSuccess() {
      // Tells React Query to fetch all classes again after update
      ctx.invalidateQueries([QUERY_ALL_CLASSES]);
    },
  });

  // Handle for deleting property
  const deleteProperty = trpc.useMutation(['class.deleteProperty'], {
    onSuccess() {
      ctx.invalidateQueries([QUERY_ALL_CLASSES]);
    },
  });

  const createClass = trpc.useMutation(['class.create'], {
    onSuccess() {
      ctx.invalidateQueries([QUERY_ALL_CLASSES]);
    },
  });

  const deleteClass = trpc.useMutation(['class.delete'], {
    onSuccess() {
      ctx.invalidateQueries([QUERY_ALL_CLASSES]);
    },
  });

  // Submits property
  const onSubmitProperty = useCallback(() => {
    const { name, type, description } = propertyData;
    if (!name || !type || !description) return;
    addProperty.mutate({
      name,
      description,
      type,
      classId: idxToCreate,
    });
  }, [addProperty, idxToCreate, propertyData]);

  // Deletes property
  const onDeleteProperty = useCallback(
    (id: string) => {
      deleteProperty.mutate({ id });
    },
    [deleteProperty],
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

  const onCreateClass = useCallback(() => {
    createClass.mutate(classProperties);
  }, [classProperties, createClass]);

  const onDeleteClass = useCallback(
    (id: string) => {
      deleteClass.mutate({ id });
    },
    [deleteClass],
  );

  // Listens on key events (for better UX)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        if (idxToCreate) {
          onSubmitProperty();
        } else if (isClassCreationProcess) {
          onCreateClass();
        }
        setIdxToCreate('');
        setIsClassCreationProcess(false);
        setPropertyData(DEFAULT_PROP_VALUES);
      } else if (e.key === 'Escape') {
        setIdxToCreate('');
        setPropertyData(DEFAULT_PROP_VALUES);
        setIsClassCreationProcess(false);
      }
    }

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [idxToCreate, isClassCreationProcess, onCreateClass, onSubmitProperty]);

  // Classes to show in types dropdown as relations to other classes
  const listboxClasses = useMemo(() => {
    // Exclude current class
    return classes?.filter((c) => c.id !== idxToCreate);
  }, [classes, idxToCreate]);

  return (
    <div>
      <h1 className="mb-10 text-4xl font-semibold">Classes</h1>
      {classes &&
        classes.map((c) => (
          <div key={c.id} className="my-8">
            <div className="flex items-center group">
              <div className="mr-5">
                <h4 className="text-2xl font-semibold mb"> {c.name}</h4>
                <p className="mb-2 text-sm font-inter">{c.description}</p>
              </div>
              <PencilIcon className="hidden w-6 text-gray-400 cursor-pointer group-hover:block hover:text-gray-600" />
              <TrashIcon
                onClick={() => onDeleteClass(c.id)}
                className="hidden w-6 ml-2 text-gray-400 cursor-pointer group-hover:block hover:text-gray-600"
              />
            </div>
            <table className="w-full">
              {c.properties.length > 0 && (
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
              )}
              <tbody>
                {c.properties.map((p) => (
                  <tr key={p.id} className="relative group">
                    <td className="p-2 text-sm border font-inter border-gray">
                      {p.name}
                    </td>
                    <td className="p-2 text-sm border font-inter border-gray">
                      {p.propertyType}
                    </td>
                    <td className="p-2 text-sm border font-inter border-gray">
                      {p.description}
                    </td>
                    <td className="absolute hidden -translate-y-1/2 right-2 top-1/2 group-hover:block">
                      <Button
                        type="remove"
                        text="Remove"
                        onClick={() => onDeleteProperty(p.id)}
                      />
                    </td>
                  </tr>
                ))}
                {idxToCreate === c.id ? (
                  <tr>
                    <td>
                      <input
                        type="text"
                        className="bg-transparent outline-none"
                        autoFocus
                        placeholder="Name"
                        name="name"
                        onChange={onChange}
                        value={propertyData.name}
                      />
                    </td>
                    <td>
                      <Listbox
                        value={propertyData.type}
                        onChange={(type) =>
                          setPropertyData((prevData) => ({ ...prevData, type }))
                        }
                      >
                        <div className="relative mt-1">
                          <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-pointer focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                            <span className="block truncate">
                              {propertyData.type}
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
                                {['String', 'Integer', 'DateTime'].map(
                                  (t, i) => (
                                    <Listbox.Option
                                      key={i}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                          active
                                            ? 'bg-amber-100 text-amber-900'
                                            : 'text-gray-900'
                                        }`
                                      }
                                      value={t}
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span
                                            className={`block truncate ${
                                              selected
                                                ? 'font-medium'
                                                : 'font-normal'
                                            }`}
                                          >
                                            {t}
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
                                  ),
                                )}
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
                                            selected
                                              ? 'font-medium'
                                              : 'font-normal'
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
                ) : (
                  <tr>
                    <td>
                      <Button
                        text="Add Property"
                        type="add"
                        onClick={() => setIdxToCreate(c.id)}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      {isClassCreationProcess && (
        <div className="my-4">
          <input
            type="text"
            className="block text-2xl font-semibold bg-transparent outline-none"
            placeholder="Name"
            autoFocus
            onChange={(e) =>
              setClassProperties((prevProps) => ({
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
              setClassProperties((prevProps) => ({
                ...prevProps,
                description: e.target.value,
              }))
            }
          />
        </div>
      )}
      <Button
        text="Add Class"
        type="add"
        onClick={() => setIsClassCreationProcess(true)}
      />
      <div className="mt-5 bg-gray-200">
        <MermaidDisplay />
      </div>
    </div>
  );
}

export default Index;
