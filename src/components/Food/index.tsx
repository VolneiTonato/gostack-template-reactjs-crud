import React, { useState, useCallback } from 'react';

import { FiEdit3, FiTrash } from 'react-icons/fi';
import api from '../../services/api';
import { Container } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

interface IProps {
  food: IFoodPlate;
  handleDelete: (id: number) => {};
  handleEditFood: (food: IFoodPlate) => void;
}

const Food: React.FC<IProps> = ({
  food,
  handleDelete,
  handleEditFood,
}: IProps) => {
  const [isAvailable, setIsAvailable] = useState(food.available);

  const toggleAvailable = useCallback(async () => {
    try {
      await api.put(`/foods/${food.id}`, { ...food, available: !isAvailable });
      setIsAvailable(!isAvailable);
    } catch (err) {
      alert('Erro ao alterar a disponibilidade do cardápio');
    }
  }, [isAvailable, food]);

  const setEditingFood = useCallback(() => {
    handleEditFood(food);
  }, [handleEditFood, food]);

  const setDeletingFood = useCallback(() => {
    handleDelete(food.id);
  }, [handleDelete, food]);

  return (
    <Container available={isAvailable}>
      <header>
        <img src={food.image} width="352" alt={food.name} />
      </header>
      <section className="body">
        <h2>{food.name}</h2>
        <p>{food.description}</p>
        <p className="price">
          R$ <b>{food.price}</b>
        </p>
      </section>
      <section className="footer">
        <div className="icon-container">
          <button
            type="button"
            className="icon"
            onClick={setEditingFood}
            data-testid={`edit-food-${food.id}`}
          >
            <FiEdit3 size={20} />
          </button>

          <button
            type="button"
            className="icon"
            onClick={setDeletingFood}
            data-testid={`remove-food-${food.id}`}
          >
            <FiTrash size={20} />
          </button>
        </div>

        <div className="availability-container">
          <p>{isAvailable ? 'Disponível' : 'Indisponível'}</p>

          <label htmlFor={`available-switch-${food.id}`} className="switch">
            <input
              id={`available-switch-${food.id}`}
              type="checkbox"
              checked={isAvailable}
              onChange={toggleAvailable}
              data-testid={`change-status-food-${food.id}`}
            />
            <span className="slider" />
          </label>
        </div>
      </section>
    </Container>
  );
};

export default Food;
