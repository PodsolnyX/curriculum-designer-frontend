type ModuleColorsPreset = {
  name: string;
  color: string | null;
};

export const moduleColorsPresets: ModuleColorsPreset[] = [
  { name: 'Стандартный', color: null },
  { name: 'Красный', color: '#da373f' },
  { name: 'Оранжевый', color: '#ff8c16' },
  { name: 'Лаймовый', color: '#739f00' },
  { name: 'Зеленый', color: '#2b7c01' },
  { name: 'Бирюзовый', color: '#007979' },
  { name: 'Голубой', color: '#005ce3' },
  { name: 'Синий', color: '#2F54EB' },
  { name: 'Фиолетовый', color: '#722ED1' },
  { name: 'Пурпурный', color: '#ff56b3' },
] as const;
