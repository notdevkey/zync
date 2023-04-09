import { formatPropertyType } from '@/utils/format-property';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { Class, Property, PropertyType, TypeOrRelation } from '@prisma/client';
import { Fragment } from 'react';

interface Props {
  foreign?: (Class & {
    properties: (Property & { propertyTypeRelation: TypeOrRelation })[];
  })[];
  selectedType: PropertyType;
  onChange(type: PropertyType): void;
}

export function RelationSelect({ foreign, selectedType, onChange }: Props) {
  return (
    <Listbox value={selectedType} onChange={(type) => onChange(type)}>
      <div className="relative">
        <Listbox.Button className="relative w-full text-left rounded-lg cursor-pointer sm:text-sm">
          <span className="block truncate">
            {formatPropertyType(selectedType)}
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute flex gap-4 p-3 mt-1 overflow-auto text-base rounded-md shadow-lg bg-darkblue-200 max-h-60 sm:text-sm">
            <div>
              <h6 className="mb-2 text-xs font-medium uppercase text-darkblue-100">
                Primitive
              </h6>
              {Object.values(PropertyType)
                .filter((p) => p !== PropertyType.FOREIGN)
                .map((propertyType, i) => (
                  <Listbox.Option
                    key={i}
                    className={({ active }) =>
                      `relative cursor-default w-24 select-none rounded-md text-white flex items-center justify-between p-2 ${
                        active && 'bg-darkblue-300'
                      }`
                    }
                    value={propertyType}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected && 'text-white'
                          }`}
                        >
                          {formatPropertyType(propertyType)}
                        </span>
                        {selected ? (
                          <span className="flex items-center text-blue-100">
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
            </div>
            <div className="w-[1px] self-stretch bg-darkblue-100" />
            <div>
              <h6 className="mb-2 text-xs font-medium uppercase text-darkblue-100">
                Foreign
              </h6>
              {foreign?.map((c) => (
                <Listbox.Option
                  key={c.id}
                  className={({ active }) =>
                    `relative cursor-default w-24 select-none rounded-md text-white flex items-center justify-between p-2 ${
                      active && 'bg-darkblue-300'
                    }`
                  }
                  value={c.name}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected && 'text-white'}`}
                      >
                        {c.name}
                      </span>
                      {selected ? (
                        <span className="flex items-center ml-2 text-blue-100">
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
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
  );
}
