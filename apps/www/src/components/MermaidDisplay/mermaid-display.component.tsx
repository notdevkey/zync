import { PrimitiveType } from '@/consts/enums';
import { useAxios } from '@/hooks/use-axios';
import { Class, Property } from '@prisma/client';
import { Mermaid } from 'mdx-mermaid/lib/Mermaid';
import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';

interface Props {
  workspaceId: string;
}

export function MermaidDisplay({ workspaceId }: Props) {
  const axios = useAxios();
  const { data: classes } = useQuery(['classes'], async () => {
    const { data } = await axios.get<
      (Class & {
        properties: (Property & { propertyTypeRelation: TypeOrRelation })[];
      })[]
    >(`/workspaces/${workspaceId}/classes`);
    return data;
  });

  // Generates a continuous string of classes formatted for mermaid display
  const generateClasses = useCallback(() => {
    if (!classes) return;

    const formattedClasses = classes.reduce(
      (prev, curr) =>
        // Imagine prev as all previous values iteratively before curr in each loop
        prev +
        `
          class ${curr.name.replace(' ', '_')} {
            ${curr.properties
              .map((p) => `${p.propertyType} ${p.name.toLowerCase()}\n`)
              .join('')}
          }
        `,
      '',
    );
    return formattedClasses;
  }, [classes]);

  /* Generates a continuous string of relations between classes
  formatted for mermaid display */
  const generateRelations = useCallback(() => {
    if (!classes) return;

    const relations = classes.reduce(
      (prev, curr) =>
        prev +
        curr.properties
          .map((p) => {
            // If a the type if a primitive one, then we don't care about drawing relations for that
            if (
              !Object.values(PrimitiveType).includes(
                p.propertyType as PrimitiveType,
              )
            ) {
              // TODO: Generate different relation according to relation type
              return `${curr.name.replace(
                ' ',
                '_',
              )} --> ${p.propertyType.replace(' ', '_')}\n`;
            }
          })
          .join(''),
      '',
    );
    return relations;
  }, [classes]);

  const formattedClasses = useMemo(() => {
    const classes = generateClasses();
    const relations = generateRelations();

    // const relations = generateRelations();
    return relations + '\n' + classes;
  }, [generateClasses, generateRelations]);

  return (
    <Mermaid
      chart={`
        classDiagram

        ${formattedClasses}
        `}
    />
  );
}
