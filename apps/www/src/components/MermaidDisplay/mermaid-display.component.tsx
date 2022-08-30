import { PrimitiveType } from '@/consts/enums';
import { trpc } from '@/utils/trpc';
import { Mermaid } from 'mdx-mermaid/lib/Mermaid';
import { useCallback, useMemo } from 'react';

export function MermaidDisplay() {
  const { data: classes } = trpc.useQuery(['class.all']);

  // Generates a continuous string of classes formatted for mermaid display
  const generateClasses = useCallback(() => {
    if (!classes) return;

    const formattedClasses = classes.reduce(
      (prev, curr) =>
        // Imagine prev as all previous values iteratively before curr in each loop
        prev +
        `
          class ${curr.name} {
            ${curr.properties
              .map((p) => `${p.type} ${p.name.toLowerCase()}\n`)
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
              !Object.values(PrimitiveType).includes(p.type as PrimitiveType)
            ) {
              // TODO: Generate different relation according to relation type
              return `${curr.name} --> ${p.type}\n`;
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

    if (!classes || !relations) return;
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
