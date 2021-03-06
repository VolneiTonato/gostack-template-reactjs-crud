import React, { useState, useEffect, useCallback } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const loadFoods = useCallback(async () => {
    const { data } = await api.get<IFoodPlate[]>('/foods');

    if (data) setFoods(data);
  }, []);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const { data } = await api.post<IFoodPlate>('/foods', {
        ...food,
        available: true,
      });

      setFoods((currents: IFoodPlate[]) => [...currents, data]);
    } catch (err) {
      alert('Erro ao gravar cardápio');
    }
  }

  const handleUpdateFood = useCallback(
    async (food: Omit<IFoodPlate, 'id' | 'available'>) => {
      try {
        const { data } = await api.put<IFoodPlate>(`/foods/${editingFood.id}`, {
          ...editingFood,
          ...food,
        });

        setFoods(
          foods.map(mappedFood =>
            mappedFood.id === editingFood.id ? data : mappedFood,
          ),
        );
      } catch (err) {
        alert('Erro ao alterar cardápio');
      }
    },
    [editingFood, foods],
  );

  async function handleDeleteFood(id: number): Promise<void> {
    try {
      await api.delete(`/foods/${id}`);

      const newFoods = foods.filter(food => food.id !== id);

      setFoods(newFoods);
    } catch (err) {
      alert('Erro ao remover cardápio');
    }
  }

  const toggleModal = useCallback(() => {
    setModalOpen(!modalOpen);
  }, [modalOpen]);

  const toggleEditModal = useCallback(() => {
    setEditModalOpen(!editModalOpen);
  }, [editModalOpen]);

  const handleEditFood = useCallback((food: IFoodPlate) => {
    setEditingFood(food);
    toggleEditModal();
  }, []);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
