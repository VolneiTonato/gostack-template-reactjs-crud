import { ValidationError } from 'yup';

interface IErrorProps {
  [key: string]: string;
}

export default function yupValidationErrors(
  err: ValidationError,
): IErrorProps | any {
  const validationErros: IErrorProps = {};

  if (!Array.isArray(err.inner)) return err;

  err.inner.forEach(error => {
    validationErros[error.path] = error.message;
  });

  return validationErros;
}
