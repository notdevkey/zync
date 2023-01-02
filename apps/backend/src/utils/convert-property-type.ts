import { PropertyType } from '@prisma/client';

export function convertPropertyType(type: PropertyType) {
  if (Object.values(PropertyType).includes(type)) {
    return { type };
  } else {
    return { type: PropertyType.FOREIGN, name: type };
  }
}
