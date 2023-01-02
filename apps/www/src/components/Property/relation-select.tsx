import { formatPropertyType } from '@/utils/format-property';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { PropertyType } from '@prisma/client';
import { Fragment } from 'react';

interface Props {
  foreign?: string[];
  selectedType: string;
  onChange(type: PropertyType | string): void;
}

export function RelationSelect({ foreign, selectedType, onChange }: Props) {
  return (
    <Listbox
      value={selectedType}
      onChange={(typeRelation) => {
        onChange(typeRelation);
      }}
    >
      <div>
        <Listbox.Button className="relative w-full text-left rounded-lg outline-none cursor-pointer sm:text-sm">
          <div
            className={`rounded-md py-0.5 px-3 font-medium bg-orange-300/[0.1] w-fit  text-orange-300 ${
              selectedType === PropertyType.STRING &&
              'bg-orange-300/[0.1] text-orange-300'
            } ${
              selectedType === PropertyType.INTEGER &&
              'bg-cyan-300/[0.1] text-cyan-300'
            } ${
              selectedType === PropertyType.DATE_TIME &&
              'bg-green-300/[0.1] text-green-300'
            } ${
              !Object.values(PropertyType).includes(
                selectedType as PropertyType,
              ) && 'bg-violet-300/[0.1] text-violet-300'
            }`}
          >
            {formatPropertyType(selectedType || '')}
          </div>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 flex gap-4 p-3 mt-1 overflow-auto text-base rounded-md shadow-lg outline-none bg-darkblue-200 max-h-60 sm:text-sm">
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
              {foreign?.map((c, i) => (
                <Listbox.Option
                  key={i}
                  className={({ active }) =>
                    `relative cursor-default w-24 select-none rounded-md text-white flex items-center justify-between p-2 ${
                      active && 'bg-darkblue-300'
                    }`
                  }
                  value={c}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected && 'text-white'}`}
                      >
                        {c}
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
