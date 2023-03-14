import { TDEngine, ITwoDCoordinates } from "../engine/TDEngine";

export interface IStage {
  direction: "left" | "right" | "up" | "down" | "start" | "end";
  limit: ITwoDCoordinates;
}

export interface IMap {
  mapParams: {
    width: number;
    height: number;
    gridStep: number;
    backgroundColor: string;
    gridColor: string;
    mapTilesArr: ITwoDCoordinates[];
    towerTilesArr: ITwoDCoordinates[];
    tileCenter: number;
    closestTile: ITwoDCoordinates;
  };
  renderParams: {
    mapRoadSpriteSource: HTMLImageElement | null;
    isMapSpritesLoaded: boolean;
  };
  stageArr: IStage[];
}

class Map {
  constructor(
    public engine: TDEngine,
    public mapParams: IMap["mapParams"] = {
      width: 960,
      height: 960,
      gridStep: 64,
      backgroundColor: "#ffae70",
      gridColor: "#000000",
      mapTilesArr: [{ x: 0, y: 0 }],
      towerTilesArr: [],
      tileCenter: 0,
      closestTile: { x: 0, y: 0 },
    },
    public renderParams: IMap["renderParams"] = {
      mapRoadSpriteSource: null,
      isMapSpritesLoaded: false,
    },
    public stageArr: IMap["stageArr"] = [],
  ) {
    // set tile center
    this.mapParams.tileCenter = this.mapParams.gridStep / 2;

    // set map start and end stages
    this.stageArr = [
      { direction: "start", limit: { x: 0, y: this.tileToNumber(1) } },
      {
        direction: "right",
        limit: { x: this.tileToNumber(14), y: this.tileToNumber(1) },
      },
      {
        direction: "down",
        limit: { x: this.tileToNumber(14), y: this.tileToNumber(4) },
      },
      {
        direction: "left",
        limit: { x: this.tileToNumber(1), y: this.tileToNumber(4) },
      },
      {
        direction: "down",
        limit: { x: this.tileToNumber(1), y: this.tileToNumber(6) },
      },
      {
        direction: "right",
        limit: { x: this.tileToNumber(14), y: this.tileToNumber(6) },
      },
      {
        direction: "down",
        limit: { x: this.tileToNumber(14), y: this.tileToNumber(9) },
      },
      {
        direction: "left",
        limit: { x: this.tileToNumber(1), y: this.tileToNumber(9) },
      },
      {
        direction: "down",
        limit: { x: this.tileToNumber(1), y: this.tileToNumber(14) },
      },
      {
        direction: "right",
        limit: { x: this.tileToNumber(5), y: this.tileToNumber(14) },
      },
      {
        direction: "up",
        limit: { x: this.tileToNumber(5), y: this.tileToNumber(11) },
      },
      {
        direction: "right",
        limit: { x: this.tileToNumber(8), y: this.tileToNumber(11) },
      },
      {
        direction: "down",
        limit: { x: this.tileToNumber(8), y: this.tileToNumber(14) },
      },
      {
        direction: "right",
        limit: { x: this.tileToNumber(10), y: this.tileToNumber(14) },
      },
      {
        direction: "up",
        limit: { x: this.tileToNumber(10), y: this.tileToNumber(11) },
      },
      {
        direction: "right",
        limit: { x: this.tileToNumber(12), y: this.tileToNumber(11) },
      },
      {
        direction: "down",
        limit: { x: this.tileToNumber(12), y: this.tileToNumber(14) },
      },

      {
        direction: "right",
        limit: { x: this.tileToNumber(14), y: this.tileToNumber(14) },
      },
      {
        direction: "up",
        limit: { x: this.tileToNumber(14), y: this.tileToNumber(12) },
      },
      {
        direction: "right",
        limit: { x: this.tileToNumber(15), y: this.tileToNumber(12) },
      },
      {
        direction: "end",
        limit: { x: this.tileToNumber(16), y: this.tileToNumber(12) },
      },
    ];

    // create mapTilesArr
    this.createMapTilesArr();

    // pop tiles which is occupied by map path
    this.popMapPathTiles();

    this.renderParams.mapRoadSpriteSource = new Image(256, 448);
    this.renderParams.mapRoadSpriteSource.src =
      "/sprites/map/mapRoadSprite.png";
    this.renderParams.mapRoadSpriteSource.onload = () =>
      (this.renderParams.isMapSpritesLoaded = true);
  }

  public tileToNumber(tilesCount: number) {
    return tilesCount * this.mapParams.gridStep;
  }

  public popMapPathTiles() {
    this.stageArr.forEach((stage, index) => {
      if (stage.direction !== "start" && stage.direction !== "end") {
        switch (stage.direction) {
          case "right": {
            for (
              let x = this.stageArr[index - 1].limit.x;
              x < stage.limit.x;
              x += this.mapParams.gridStep
            ) {
              this.mapParams.mapTilesArr = this.mapParams.mapTilesArr.filter(
                (tile) =>
                  tile.x !== x ||
                  tile.y !==
                    stage.limit.y -
                      (this.stageArr[index - 1].direction === "start" ||
                      this.stageArr[index - 1].direction === "end"
                        ? 0
                        : this.mapParams.gridStep),
              );
            }
            break;
          }
          case "left": {
            for (
              let x = stage.limit.x;
              x < this.stageArr[index - 1].limit.x;
              x += this.mapParams.gridStep
            ) {
              this.mapParams.mapTilesArr = this.mapParams.mapTilesArr.filter(
                (tile) =>
                  tile.x !== x ||
                  tile.y !==
                    stage.limit.y -
                      (this.stageArr[index - 1].direction === "start" ||
                      this.stageArr[index - 1].direction === "end"
                        ? 0
                        : this.mapParams.gridStep),
              );
            }
            break;
          }
          case "up": {
            for (
              let y = stage.limit.y - this.mapParams.gridStep;
              y < this.stageArr[index - 1].limit.y;
              y += this.mapParams.gridStep
            ) {
              this.mapParams.mapTilesArr = this.mapParams.mapTilesArr.filter(
                (tile) =>
                  tile.x !== stage.limit.x - this.mapParams.gridStep ||
                  tile.y !== y,
              );
            }
            break;
          }
          case "down": {
            for (
              let y = this.stageArr[index - 1].limit.y;
              y < stage.limit.y;
              y += this.mapParams.gridStep
            ) {
              this.mapParams.mapTilesArr = this.mapParams.mapTilesArr.filter(
                (tile) =>
                  tile.x !==
                    stage.limit.x -
                      (this.stageArr[index - 1].direction === "right"
                        ? this.mapParams.gridStep
                        : 0) || tile.y !== y,
              );
            }
            break;
          }
        }
      }
    });
  }

  public debugHighlightMapTiles() {
    this.mapParams.mapTilesArr.forEach((tile) => {
      this.engine.context!.map!.beginPath();
      this.engine.context!.map!.strokeStyle = "red";
      this.engine.context!.map!.strokeRect(
        tile.x,
        tile.y,
        this.mapParams.gridStep,
        this.mapParams.gridStep,
      );
      this.engine.context!.map!.closePath();
    });
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
    // draw map 2d representation due to map stages
    this.stageArr.forEach((stage, index) => {
      if (stage.direction !== "start" && stage.direction !== "end") {
        this.engine.context!.map!.beginPath();
        this.engine.context!.map!.fillStyle = this.mapParams.backgroundColor;
        // draw map path according to stage array
        switch (stage.direction) {
          // right
          case "right": {
            this.engine.context!.map!.rect(
              this.stageArr[index - 1].limit.x,
              this.stageArr[index - 1].limit.y -
                (this.stageArr[index - 1].direction === "start"
                  ? 0
                  : this.mapParams.gridStep),
              stage.limit.x -
                this.stageArr[index - 1].limit.x +
                (this.stageArr[index - 1].direction === "start"
                  ? 0
                  : this.mapParams.gridStep) -
                this.mapParams.gridStep,
              this.mapParams.gridStep,
            );
            break;
          }
          // down
          case "down": {
            this.engine.context!.map!.rect(
              this.stageArr[index - 1].limit.x -
                (this.stageArr[index - 1].direction === "right"
                  ? this.mapParams.gridStep
                  : 0),
              this.stageArr[index - 1].limit.y,
              this.mapParams.gridStep,
              stage.limit.y -
                this.stageArr[index - 1].limit.y -
                this.mapParams.gridStep +
                (this.stageArr[index - 1].direction === "right"
                  ? this.mapParams.gridStep
                  : 0) +
                (this.stageArr[index - 1].direction === "left"
                  ? this.mapParams.gridStep
                  : 0),
            );
            break;
          }
          // left
          case "left": {
            this.engine.context!.map!.rect(
              stage.limit.x,
              this.stageArr[index - 1].limit.y - this.mapParams.gridStep,
              Math.abs(this.stageArr[index - 1].limit.x - stage.limit.x),
              this.mapParams.gridStep,
            );
            break;
          }
          // up
          case "up": {
            this.engine.context!.map!.rect(
              stage.limit.x - this.mapParams.gridStep,
              stage.limit.y - this.mapParams.gridStep,
              this.mapParams.gridStep,
              this.stageArr[index - 1].limit.y - stage.limit.y,
            );
            break;
          }
          default: {
            throw new Error(`Unknown direction type: ${stage.direction}`);
          }
        }
        this.engine.context!.map!.fill();
        this.engine.context!.map!.closePath();
      }
    });
    // draw map tiles to debug
    // this.debugHighlightMapTiles();
  };

  public drawGrid() {
    if (this.engine.isShowGrid) {
      this.engine.context!.map!.beginPath();
      this.engine.context!.map!.setLineDash([]);
      for (let x = 0; x <= this.mapParams.width; x += this.mapParams.gridStep) {
        this.engine.context!.map!.moveTo(0.5 + x + this.mapParams.gridStep, 0);
        this.engine.context!.map!.lineTo(
          0.5 + x + this.mapParams.gridStep,
          this.mapParams.height + this.mapParams.gridStep,
        );
      }
      for (
        let y = 0;
        y <= this.mapParams.height;
        y += this.mapParams.gridStep
      ) {
        this.engine.context!.map!.moveTo(0, y + this.mapParams.gridStep);
        this.engine.context!.map!.lineTo(
          this.mapParams.width + this.mapParams.gridStep,
          y + this.mapParams.gridStep,
        );
      }
      this.engine.context!.map!.strokeStyle = this.mapParams.gridColor;
      this.engine.context!.map!.stroke();
      this.engine.context!.map!.closePath();
    }
  }
}

export default Map;
