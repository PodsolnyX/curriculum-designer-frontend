import { makeAutoObservable } from 'mobx';

class PositionsStore {
  constructor() {
    makeAutoObservable(this);
  }
}

export const positionsStore = new PositionsStore();
