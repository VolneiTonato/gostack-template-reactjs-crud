import React, { useRef, useCallback } from 'react';

import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';
import numberUtils from '../../utils/number';
import formUtils from '../../utils/form';
import * as Yup from 'yup';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleUpdateFood: (food: Omit<IFoodPlate, 'id' | 'available'>) => void;
  editingFood: IFoodPlate;
}

interface IEditFoodData {
  name: string;
  image: string;
  price: string;
  description: string;
}

const ModalEditFood: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  editingFood,
  handleUpdateFood,
}) => {
  const formRef = useRef<FormHandles>(null);



  const handleSubmit = useCallback(
    async (data: IEditFoodData) => {
      try {
        formRef.current?.setErrors([]);
        const schema = Yup.object().shape({
          description: Yup.string().required('Descrição obrigatória'),
          name: Yup.string().required('Nome obrigatório'),
          image: Yup.string()
            .required('Nome obrigatório')
            .url('Link da imagem inválida!'),
          price: Yup.string()
            .required('Preço obrigatório')
            .transform((value: string) => {
              const newValue = numberUtils.numbers.onlyNumber(value);

              if (!newValue || newValue <= 0.01) return '';

              return value;
            }),
        });

        await schema.validate(data, { abortEarly: false });

        setIsOpen();

        handleUpdateFood(data);
      } catch (err) {
        const errorsData = formUtils.yupValidationErros(err);

        formRef.current?.setErrors(errorsData);
      }
    },
    [handleUpdateFood, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalEditFood;
