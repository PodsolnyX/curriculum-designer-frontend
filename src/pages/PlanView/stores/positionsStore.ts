import { makeAutoObservable } from 'mobx';

class PositionsStore {
  heights: Record<string, Record<string, number>> = {};
  horizontalCoordinates: Record<string, Record<string, number>> = {};
  atomsContainerWidth: number = 50;

  constructor() {
    makeAutoObservable(this);
  }

  setAtomsContainerWidth(width: number) {
    this.atomsContainerWidth = width;
  }

  reset() {
    this.heights = {};
    this.horizontalCoordinates = {};
  }

  updateHeight(rowId: string, containerId: string, height: number) {
    const currentHeight = this.heights[rowId]?.[containerId];
    if (currentHeight === height) return;

    if (!this.heights[rowId]) {
      this.heights[rowId] = {};
    }
    this.heights[rowId][containerId] = height;
  }

  updateHorizontalCoordinate(
    rowId: string,
    containerId: string,
    width: number,
  ) {
    if (!this.horizontalCoordinates[rowId]) {
      this.horizontalCoordinates[rowId] = {};
    }
    this.horizontalCoordinates[rowId][containerId] = width;
  }

  getMaxHeight(rowId: string): number {
    const rowHeights = this.heights[rowId] || {};
    return Object.values(rowHeights).reduce((max, h) => Math.max(max, h), 0);
  }

  getHorizontalCoordinate(rowId: string, containerId: string): number {
    const gap = 40;
    let totalCoordinate = 20;
    const currentCoordinates = this.horizontalCoordinates[rowId] || {};

    const findModuleFirstEntry = (_containerId: string): number | undefined => {
      for (const rowId of Object.keys(this.horizontalCoordinates)) {
        const rowData = this.horizontalCoordinates[rowId];
        if (rowData && _containerId in rowData) {
          const idsList = Object.keys(rowData);
          if (idsList.indexOf(_containerId) === 0) {
            return rowData[_containerId] + gap;
          } else {
            return (
              findModuleFirstEntry(
                idsList[idsList.indexOf(_containerId) - 1],
              )! +
              rowData[_containerId] +
              gap
            );
          }
        }
      }
    };

    const coordinatesList = Object.entries(currentCoordinates);
    if (
      coordinatesList.length &&
      coordinatesList[0][0] !== containerId &&
      coordinatesList[
        coordinatesList.findIndex((cord) => cord[0] === containerId) - 1
      ]
    ) {
      totalCoordinate +=
        findModuleFirstEntry(
          coordinatesList[
            coordinatesList.findIndex((cord) => cord[0] === containerId) - 1
          ][0],
        ) || 0;
    }

    return totalCoordinate;
  }

  getTopCoordinate(rowId: string): number {
    let totalCoordinate = 0;
    const rowIds = Object.keys(this.heights);
    for (const currentRowId of rowIds) {
      if (currentRowId === rowId) break;
      totalCoordinate += this.getMaxHeight(currentRowId);
    }
    return totalCoordinate;
  }
}

export const positionsStore = new PositionsStore();
