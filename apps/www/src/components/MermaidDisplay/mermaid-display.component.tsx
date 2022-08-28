import { trpc } from '@/utils/trpc';
import { Mermaid } from 'mdx-mermaid/lib/Mermaid';
import { useCallback, useMemo } from 'react';

export function MermaidDisplay() {
  const { data: classes } = trpc.useQuery(['class.all']);

  const generateClasses = useCallback(() => {
    if (!classes) return;
    const formattedClasses = classes.reduce(
      (prev, curr) =>
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

  const formattedClasses = useMemo(() => {
    const classes = generateClasses();
    return classes;
  }, [generateClasses]);

  return (
    <Mermaid
      chart={`
      classDiagram

      ${formattedClasses}
      `}
    />
  );
}
