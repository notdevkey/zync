import { useEffect } from 'react';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';

type FormProps<TFormValues> = {
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
};

export const Form = <TFormValues extends Record<string, unknown>>({
  onSubmit,
  children,
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>();

  // Listener for enter key to know when to handle adding property to class
  useEffect(() => {
    function handleEnter(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        methods.handleSubmit(onSubmit);
      }
    }

    document.addEventListener('keydown', handleEnter);

    return () => {
      document.removeEventListener('keydown', handleEnter);
    };
  }, [methods, onSubmit]);

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>{children(methods)}</form>
  );
};
