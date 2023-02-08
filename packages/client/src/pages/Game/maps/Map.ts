import TDEngine, { ITwoDCoordinates } from "../engine/TDEngine";

export interface IMap {
  mapParams: {
    width: number;
    height: number;
    gridStep: number;
    backgroundColor: string;
    gridColor: string;
    startX: number;
    startY: number;
    rightBorder: number;
    bottomBorder: number;
    mapTilesArr: ITwoDCoordinates[];
    tileCenter: number;
    closestTile: ITwoDCoordinates;
  };
}

class Map {
  constructor(
    public engine: TDEngine,
    public mapParams: IMap["mapParams"] = {
      width: 600,
      height: 600,
      gridStep: 30,
      backgroundColor: "#bdbdbd",
      gridColor: "#000000",
      startX: 0,
      startY: 90,
      rightBorder: 0,
      bottomBorder: 300,
      mapTilesArr: [{ x: 0, y: 0 }],
      tileCenter: 0,
      closestTile: { x: 0, y: 0 },
    },
  ) {
    this.mapParams.tileCenter = this.mapParams.gridStep / 2;
    this.mapParams.rightBorder = this.mapParams.width / 2;

    // create mapTilesArr
    this.createMapTilesArr();

    // pop tiles which is occupied by map path
    this.popMapPathTiles();
  }

  public popMapPathTiles() {
    // first stage
    for (
      let x = 0;
      x <= this.mapParams.rightBorder;
      x += this.mapParams.gridStep
    ) {
      this.mapParams.mapTilesArr = this.mapParams.mapTilesArr.filter(
        (tile) => tile.x !== x || tile.y !== this.mapParams.startY,
      );
    }
    // second stage
    for (
      let y = this.mapParams.startY;
      y <= this.mapParams.bottomBorder;
      y += this.mapParams.gridStep
    ) {
      this.mapParams.mapTilesArr = this.mapParams.mapTilesArr.filter(
        (tile) => tile.x !== this.mapParams.rightBorder || tile.y !== y,
      );
    }
    // third stage
    for (
      let x = this.mapParams.rightBorder;
      x <= this.mapParams.width;
      x += this.mapParams.gridStep
    ) {
      this.mapParams.mapTilesArr = this.mapParams.mapTilesArr.filter(
        (tile) =>
          tile.x !== x ||
          tile.y !== this.mapParams.bottomBorder + this.mapParams.gridStep,
      );
    }
  }

  public createMapTilesArr() {
    for (let x = 0; x <= this.mapParams.width; x += this.mapParams.gridStep) {
      for (
        let y = 0;
        y <= this.mapParams.height;
        y += this.mapParams.gridStep
      ) {
        this.mapParams.mapTilesArr.push({ x: x, y: y });
      }
    }
  }

  public drawMap = () => {
    this.engine.mapContext?.beginPath();
    this.engine.mapContext!.fillStyle = this.mapParams.backgroundColor;

    // first right line
    this.engine.mapContext?.rect(
      this.mapParams.startX,
      this.mapParams.startY,
      this.mapParams.width / 2,
      this.mapParams.gridStep,
    );
    // turn to the bottom
    this.engine.mapContext?.rect(
      this.mapParams.width / 2,
      this.mapParams.startY,
      this.mapParams.gridStep,
      this.mapParams.bottomBorder - this.mapParams.gridStep,
    );
    // turn to the right
    this.engine.mapContext?.rect(
      this.mapParams.width / 2,
      this.mapParams.bottomBorder + this.mapParams.gridStep,
      this.mapParams.width / 2,
      this.mapParams.gridStep,
    );
    this.engine.mapContext?.fill();
    this.engine.mapContext?.closePath();
  };

  public drawGrid() {
    if (this.engine.isShowGrid) {
      this.engine.mapContext?.beginPath();
      this.engine.mapContext?.setLineDash([]);
      for (let x = 0; x <= this.mapParams.width; x += this.mapParams.gridStep) {
        this.engine.mapContext?.moveTo(0.5 + x + this.mapParams.gridStep, 0);
        this.engine.mapContext?.lineTo(
          0.5 + x + this.mapParams.gridStep,
          this.mapParams.height + this.mapParams.gridStep,
        );
      }
      for (
        let y = 0;
        y <= this.mapParams.height;
        y += this.mapParams.gridStep
      ) {
        this.engine.mapContext?.moveTo(0, y + this.mapParams.gridStep);
        this.engine.mapContext?.lineTo(
          this.mapParams.width + this.mapParams.gridStep,
          y + this.mapParams.gridStep,
        );
      }
      this.engine.mapContext!.strokeStyle = this.mapParams.gridColor;
      this.engine.mapContext?.stroke();
      this.engine.mapContext?.closePath();
    }
  }
}

export default Map;
