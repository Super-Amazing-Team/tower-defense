import TDEngine, { ITwoDCoordinates } from "../engine/TDEngine";

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
  stageArr: IStage[];
  mapSpritePath: string;
  mapSprite: HTMLImageElement | null;
  mapRoadDirections: Record<string, ITwoDCoordinates>;
  grassBackrgroundCanvas: HTMLCanvasElement;
  grassBackrgroundCanvasContext: CanvasRenderingContext2D | null;
  grassTileCanvas: Record<string, HTMLCanvasElement | null>;
  grassTileCanvasContext: Record<string, CanvasRenderingContext2D | null>;
  stoneTileCanvas: Record<string, HTMLCanvasElement | null>;
  stoneTileCanvasContext: Record<string, CanvasRenderingContext2D | null>;
  treeTileCanvas: Record<string, HTMLCanvasElement | null>;
  treeTileCanvasContext: Record<string, CanvasRenderingContext2D | null>;
  randomTileSpriteFrequency: number;
  turnOffset: number;
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
    public stageArr: IMap["stageArr"] = [],
    public mapSpritePath: IMap["mapSpritePath"] = "/sprites/map/mapSprite.png",
    public mapSprite: IMap["mapSprite"] = null,
    public mapRoadDirections: IMap["mapRoadDirections"] = {},
    public grassBackrgroundCanvas: IMap["grassBackrgroundCanvas"] = document.createElement(
      "canvas",
    ),
    public grassBackrgroundCanvasContext: IMap["grassBackrgroundCanvasContext"] = null,
    public grassTileCanvas: IMap["grassTileCanvas"] = {
      one: document.createElement("canvas"),
      two: document.createElement("canvas"),
    },
    public grassTileCanvasContext: IMap["grassTileCanvasContext"] = {},
    public stoneTileCanvas: IMap["stoneTileCanvas"] = {
      one: document.createElement("canvas"),
      two: document.createElement("canvas"),
      three: document.createElement("canvas"),
      four: document.createElement("canvas"),
    },
    public stoneTileCanvasContext: IMap["stoneTileCanvasContext"] = {},
    public greenTreeTileCanvas: IMap["treeTileCanvas"] = {
      one: document.createElement("canvas"),
      two: document.createElement("canvas"),
      three: document.createElement("canvas"),
      four: document.createElement("canvas"),
    },
    public greenTreeTileCanvasContext: IMap["treeTileCanvasContext"] = {},
    public dryTreeTileCanvas: IMap["treeTileCanvas"] = {
      one: document.createElement("canvas"),
      two: document.createElement("canvas"),
      three: document.createElement("canvas"),
      four: document.createElement("canvas"),
    },
    public dryTreeTileCanvasContext: IMap["treeTileCanvasContext"] = {},
    public randomTileSpriteFrequency: IMap["randomTileSpriteFrequency"] = 4,
    public turnOffset: IMap["turnOffset"] = 24,
  ) {
    // sprite shortcuts
    this.mapRoadDirections = {
      right: { x: 0, y: 0 },
      rightStart: { x: 0, y: this.tileToNumber(1) },
      rightEnd: { x: this.tileToNumber(2), y: this.tileToNumber(1) },
      rightTurnDown: {
        x: this.tileToNumber(3) - this.turnOffset,
        y: this.tileToNumber(3),
      },
      rightTurnUp: {
        x: this.tileToNumber(3) - this.turnOffset,
        y: this.tileToNumber(6) - this.turnOffset,
      },
      left: { x: 0, y: 0 },
      leftStart: { x: this.tileToNumber(2), y: this.tileToNumber(1) },
      leftTurnUp: { x: this.tileToNumber(2), y: this.tileToNumber(6) },
      leftTurnDown: { x: 0, y: this.tileToNumber(3) },
      up: { x: this.tileToNumber(2), y: 0 },
      upStart: { x: this.tileToNumber(1), y: 0 },
      down: { x: this.tileToNumber(2), y: 0 },
      downStart: { x: this.tileToNumber(1), y: this.tileToNumber(2) },
      downTurnLeft: {
        x: this.tileToNumber(3) - this.turnOffset,
        y: this.tileToNumber(6) - this.turnOffset,
      },
      downTurnRight: {
        x: this.tileToNumber(0),
        y: this.tileToNumber(6) - this.turnOffset,
      },
    };
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

    // map canvas tiles create
    // grass
    this.grassBackrgroundCanvas!.width = this.mapParams.gridStep;
    this.grassBackrgroundCanvas!.height = this.mapParams.gridStep;
    this.grassBackrgroundCanvasContext =
      this.grassBackrgroundCanvas?.getContext("2d")!;
    // grass
    for (const [key, canvas] of Object.entries(this.grassTileCanvas)) {
      canvas!.width = this.mapParams.gridStep;
      canvas!.height = this.mapParams.gridStep;
      this.grassTileCanvasContext[key] = canvas?.getContext("2d")!;
    }
    // stone
    for (const [key, canvas] of Object.entries(this.stoneTileCanvas)) {
      canvas!.width = this.mapParams.gridStep;
      canvas!.height = this.mapParams.gridStep;
      this.stoneTileCanvasContext[key] = canvas?.getContext("2d")!;
    }
    // green tree
    for (const [key, canvas] of Object.entries(this.greenTreeTileCanvas)) {
      canvas!.width = this.mapParams.gridStep;
      canvas!.height = this.mapParams.gridStep;
      this.greenTreeTileCanvasContext[key] = canvas?.getContext("2d")!;
    }
    // dry tree
    for (const [key, canvas] of Object.entries(this.dryTreeTileCanvas)) {
      canvas!.width = this.mapParams.gridStep;
      canvas!.height = this.mapParams.gridStep;
      this.dryTreeTileCanvasContext[key] = canvas?.getContext("2d")!;
    }
  }

  public init() {
    return new Promise((resolve, reject) => {
      // road sprite
      this.mapSprite = new Image();
      this.mapSprite!.src = this.mapSpritePath;
      this.mapSprite.onload = () => {
        // map canvas background
        this.grassBackrgroundCanvasContext?.drawImage(
          this.mapSprite!,
          this.tileToNumber(0),
          this.tileToNumber(2),
          this.mapParams.gridStep,
          this.mapParams.gridStep,
          0,
          0,
          this.mapParams.gridStep,
          this.mapParams.gridStep,
        );
        // grass tile
        Object.entries(this.grassTileCanvasContext).forEach(
          ([, context], index) => {
            context?.drawImage(
              this.mapSprite!,
              this.tileToNumber(10),
              index * this.mapParams.gridStep,
              this.mapParams.gridStep,
              this.mapParams.gridStep,
              0,
              0,
              this.mapParams.gridStep,
              this.mapParams.gridStep,
            );
          },
        );
        // stone tile
        Object.entries(this.stoneTileCanvasContext).forEach(
          ([, context], index) => {
            context?.drawImage(
              this.mapSprite!,
              this.tileToNumber(index <= 2 ? 8 : 9),
              this.tileToNumber(index <= 2 ? 0 : 1),
              this.mapParams.gridStep,
              this.mapParams.gridStep,
              0,
              0,
              this.mapParams.gridStep,
              this.mapParams.gridStep,
            );
          },
        );
        // green tree tile
        Object.entries(this.greenTreeTileCanvasContext).forEach(
          ([, context], index) => {
            context?.drawImage(
              this.mapSprite!,
              this.tileToNumber(index <= 2 ? 4 : 5),
              this.tileToNumber(index <= 2 ? 0 : 1),
              this.mapParams.gridStep,
              this.mapParams.gridStep,
              0,
              0,
              this.mapParams.gridStep,
              this.mapParams.gridStep,
            );
          },
        );
        // dry tree tile
        Object.entries(this.dryTreeTileCanvasContext).forEach(
          ([, context], index) => {
            context?.drawImage(
              this.mapSprite!,
              this.tileToNumber(index <= 2 ? 6 : 7),
              this.tileToNumber(index <= 2 ? 0 : 1),
              this.mapParams.gridStep,
              this.mapParams.gridStep,
              0,
              0,
              this.mapParams.gridStep,
              this.mapParams.gridStep,
            );
          },
        );
        this.engine.isMapSpritesLoaded = true;
        resolve(true);
      };
      this.mapSprite.onerror = reject;
    });
  }

  public randomizeBackgroundTiles() {
    const getRandomInt = (min: number = 0, max: number = 10) => {
      return Math.random() * (max - min) + min;
    };
    const shuffleArr = (array: ITwoDCoordinates[]): ITwoDCoordinates[] => {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    };
    const randomMax =
      Object.keys(this.grassTileCanvasContext!).length +
      Object.keys(this.stoneTileCanvasContext!).length +
      Object.keys(this.greenTreeTileCanvasContext!).length +
      Object.keys(this.dryTreeTileCanvasContext!).length +
      1;
    const shuffledArray = shuffleArr(this.mapParams.mapTilesArr);
    shuffledArray
      .slice(
        0,
        Math.ceil(shuffledArray.length / this.randomTileSpriteFrequency),
      )
      .forEach((tile, index) => {
        const randomTile = Math.floor(getRandomInt(1, randomMax));
        try {
          switch (randomTile) {
            case 1: {
              this.engine.context?.mapBackground?.drawImage(
                this.grassTileCanvas.one!,
                tile.x,
                tile.y,
              );
              break;
            }
            case 2: {
              this.engine.context?.mapBackground?.drawImage(
                this.grassTileCanvas.two!,
                tile.x,
                tile.y,
              );
              break;
            }
            case 3: {
              this.engine.context?.mapBackground?.drawImage(
                this.stoneTileCanvas.one!,
                tile.x,
                tile.y,
              );
              break;
            }
            case 4: {
              this.engine.context?.mapBackground?.drawImage(
                this.stoneTileCanvas.two!,
                tile.x,
                tile.y,
              );
              break;
            }
            case 5: {
              this.engine.context?.mapBackground?.drawImage(
                this.stoneTileCanvas.three!,
                tile.x,
                tile.y,
              );
              break;
            }
            case 6: {
              this.engine.context?.mapBackground?.drawImage(
                this.stoneTileCanvas.four!,
                tile.x,
                tile.y,
              );
              break;
            }
            case 7: {
              this.engine.context?.mapBackground?.drawImage(
                this.greenTreeTileCanvas.one!,
                tile.x,
                tile.y,
              );
              break;
            }
            case 8: {
              this.engine.context?.mapBackground?.drawImage(
                this.greenTreeTileCanvas.two!,
                tile.x,
                tile.y,
              );
              break;
            }
            case 9: {
              this.engine.context?.mapBackground?.drawImage(
                this.greenTreeTileCanvas.three!,
                tile.x,
                tile.y,
              );
              break;
            }
            case 10: {
              this.engine.context?.mapBackground?.drawImage(
                this.greenTreeTileCanvas.four!,
                tile.x,
                tile.y,
              );
              break;
            }
            case 11: {
              this.engine.context?.mapBackground?.drawImage(
                this.dryTreeTileCanvas.one!,
                tile.x,
                tile.y,
              );
              break;
            }
            case 12: {
              this.engine.context?.mapBackground?.drawImage(
                this.dryTreeTileCanvas.two!,
                tile.x,
                tile.y,
              );
              break;
            }
            case 13: {
              this.engine.context?.mapBackground?.drawImage(
                this.dryTreeTileCanvas.three!,
                tile.x,
                tile.y,
              );
              break;
            }
            case 14: {
              this.engine.context?.mapBackground?.drawImage(
                this.dryTreeTileCanvas.four!,
                tile.x,
                tile.y,
              );
              break;
            }
            default:
              break;
          }
        } catch (e) {
          throw new Error(
            `Can't draw a background tile sprite, something is broken!`,
          );
        }
      });
  }

  public tileToNumber(tilesCount: number) {
    return tilesCount * this.mapParams.gridStep;
  }

  public numberToTile(length: number) {
    return length / this.mapParams.gridStep;
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

  public drawRoad(
    coords: ITwoDCoordinates = { x: 0, y: 0 },
    roadDirection: ITwoDCoordinates = { x: 0, y: 0 },
    offset: ITwoDCoordinates = { x: 0, y: 0 },
    width: number = this.mapParams.gridStep,
    height: number = this.mapParams.gridStep,
    context: CanvasRenderingContext2D = this.engine.context?.map!,
  ) {
    context.beginPath();
    context.drawImage(
      this.mapSprite!,
      roadDirection.x,
      roadDirection.y,
      width,
      height,
      coords.x - offset.x,
      coords.y - offset.y,
      width,
      height,
    );
    context.closePath();
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
        const prevStage = this.stageArr[index - 1];
        const nextStage = this.stageArr[index + 1];
        const stageTileLengthY = this.numberToTile(
          stage.limit.y - prevStage.limit.y,
        );
        const stageTileLengthX = this.numberToTile(
          stage.limit.x - prevStage.limit.x,
        );
        // draw map path according to stage array
        switch (stage.direction) {
          // right
          case "right": {
            for (
              let x =
                prevStage.limit.x +
                (prevStage.direction === "down" ? this.mapParams.gridStep : 0);
              x < stage.limit.x;
              x += this.mapParams.gridStep
            ) {
              // first tile
              if (
                x ===
                prevStage.limit.x +
                  (prevStage.direction === "down" ? this.mapParams.gridStep : 0)
              ) {
                if (prevStage.direction === "start") {
                  this.drawRoad(
                    { x: x, y: stage.limit.y },
                    this.mapRoadDirections.rightStart,
                  );
                } else if (nextStage.direction === "end") {
                  this.drawRoad(
                    {
                      x: x,
                      y: stage.limit.y - this.mapParams.gridStep,
                    },
                    {
                      x: this.mapRoadDirections.rightEnd.x + this.turnOffset,
                      y: this.mapRoadDirections.rightEnd.y,
                    },
                    { x: -this.turnOffset, y: 0 },
                    this.mapParams.gridStep,
                  );
                } else if (
                  prevStage.direction === "down" ||
                  prevStage.direction === "up"
                ) {
                  this.drawRoad(
                    {
                      x:
                        x +
                        this.turnOffset -
                        (prevStage.direction === "down" &&
                        nextStage.direction === "up" &&
                        stageTileLengthX < 3
                          ? this.mapParams.gridStep
                          : 0),
                      y:
                        this.numberToTile(prevStage.limit.y) === 1
                          ? stage.limit.y
                          : stage.limit.y - this.mapParams.gridStep,
                    },
                    this.mapRoadDirections.right,
                  );
                }
                // last tile
              } else {
                this.drawRoad(
                  {
                    x: x,
                    y:
                      this.numberToTile(prevStage.limit.y) === 1
                        ? stage.limit.y
                        : stage.limit.y - this.mapParams.gridStep,
                  },
                  this.mapRoadDirections.right,
                );
              }
            }
            break;
          }
          // down
          case "down": {
            for (
              let y =
                this.numberToTile(prevStage.limit.y) === 1
                  ? prevStage.limit.y + this.mapParams.gridStep
                  : prevStage.limit.y;
              y <= stage.limit.y;
              y += this.mapParams.gridStep
            ) {
              // first tile
              if (
                y ===
                (this.numberToTile(prevStage.limit.y) === 1
                  ? prevStage.limit.y + this.mapParams.gridStep
                  : prevStage.limit.y)
              ) {
                if (prevStage.direction === "right") {
                  this.drawRoad(
                    {
                      x: prevStage.limit.x - this.mapParams.gridStep,
                      y:
                        y === this.tileToNumber(1)
                          ? y
                          : y - this.mapParams.gridStep,
                    },
                    this.mapRoadDirections.rightTurnDown,
                    { x: this.turnOffset, y: 0 },
                    this.mapParams.gridStep + this.turnOffset,
                    this.mapParams.gridStep + this.turnOffset,
                  );
                } else if (prevStage.direction === "left") {
                  this.drawRoad(
                    {
                      x: stage.limit.x,
                      y: y - this.mapParams.gridStep + this.turnOffset,
                    },
                    this.mapRoadDirections.leftTurnDown,
                    { x: 0, y: this.turnOffset },
                    this.mapParams.gridStep + this.turnOffset,
                    this.mapParams.gridStep + this.turnOffset,
                  );
                }
                // last tile
              } else if (y === stage.limit.y) {
                if (nextStage.direction === "right") {
                  this.drawRoad(
                    {
                      x:
                        stage.limit.x -
                        (prevStage.direction === "right"
                          ? this.mapParams.gridStep
                          : 0),
                      y: y - this.mapParams.gridStep,
                    },
                    this.mapRoadDirections.downTurnRight,
                    { x: 0, y: this.turnOffset },
                    this.mapParams.gridStep + this.turnOffset,
                    this.mapParams.gridStep + this.turnOffset,
                  );
                } else if (nextStage.direction === "left") {
                  this.drawRoad(
                    {
                      x:
                        stage.limit.x -
                        this.mapParams.gridStep -
                        this.turnOffset,
                      y: y - this.mapParams.gridStep,
                    },
                    this.mapRoadDirections.downTurnLeft,
                    { x: 0, y: this.turnOffset },
                    this.mapParams.gridStep + this.turnOffset,
                    this.mapParams.gridStep + this.turnOffset,
                  );
                }
                // regular && second tile
              } else {
                // second tile
                if (y === prevStage.limit.y + this.mapParams.gridStep) {
                  if (stageTileLengthY < 3) {
                    this.drawRoad(
                      {
                        x:
                          stage.limit.x -
                          (prevStage.direction === "right"
                            ? this.mapParams.gridStep
                            : 0),
                        y: y - this.mapParams.gridStep + this.turnOffset,
                      },
                      this.mapRoadDirections.down,
                      undefined,
                      undefined,
                      this.mapParams.gridStep - this.turnOffset,
                    );
                  } else {
                    this.drawRoad(
                      {
                        x:
                          stage.limit.x -
                          (prevStage.direction === "right"
                            ? this.mapParams.gridStep
                            : 0),
                        y: y - this.mapParams.gridStep + this.turnOffset,
                      },
                      this.mapRoadDirections.down,
                    );
                  }
                  // regular tile
                } else {
                  if (this.numberToTile(prevStage.limit.y) === 1) {
                    this.drawRoad(
                      {
                        x:
                          stage.limit.x -
                          (prevStage.direction === "right"
                            ? this.mapParams.gridStep
                            : 0),
                        y: y - this.mapParams.gridStep + this.turnOffset,
                      },
                      this.mapRoadDirections.down,
                    );
                  } else {
                    this.drawRoad(
                      {
                        x:
                          stage.limit.x -
                          (prevStage.direction === "right"
                            ? this.mapParams.gridStep
                            : 0),
                        y: y - this.mapParams.gridStep,
                      },
                      this.mapRoadDirections.down,
                    );
                  }
                }
              }
            }
            break;
          }
          // left
          case "left": {
            for (
              let x = prevStage.limit.x - this.mapParams.gridStep;
              x >= stage.limit.x;
              x -= this.mapParams.gridStep
            ) {
              // first tile
              if (x === prevStage.limit.x - this.mapParams.gridStep) {
                // last tile
              } else if (x === stage.limit.x) {
                if (nextStage.direction === "down") {
                  /*
                  this.drawRoad(
                    {
                      x: x + this.turnOffset,
                      y: stage.limit.y - this.mapParams.gridStep,
                    },
                    this.mapRoadDirections.leftTurnDown,
                    { x: this.turnOffset, y: 0 },
                    this.mapParams.gridStep + this.turnOffset,
                    this.mapParams.gridStep + this.turnOffset,
                  );
                   */
                }
                // just draw map path
              } else if (x > stage.limit.x) {
                if (x > stage.limit.x + this.mapParams.gridStep) {
                  this.drawRoad(
                    {
                      x: x - this.turnOffset,
                      y: stage.limit.y - this.mapParams.gridStep,
                    },
                    this.mapRoadDirections.left,
                  );
                } else {
                  this.drawRoad(
                    { x: x, y: stage.limit.y - this.mapParams.gridStep },
                    this.mapRoadDirections.left,
                  );
                }
              }
            }
            break;
          }
          // up
          case "up": {
            for (
              let y = prevStage.limit.y;
              y >= stage.limit.y;
              y -= this.mapParams.gridStep
            ) {
              // first tile
              if (y === prevStage.limit.y) {
                if (prevStage.direction === "right") {
                  this.drawRoad(
                    {
                      x:
                        stage.limit.x -
                        this.mapParams.gridStep -
                        this.turnOffset,
                      y: y - this.mapParams.gridStep,
                    },
                    this.mapRoadDirections.rightTurnUp,
                    { x: 0, y: this.turnOffset },
                    this.mapParams.gridStep + this.turnOffset,
                    this.mapParams.gridStep + this.turnOffset,
                  );
                }
                // last tile
              } else if (y === stage.limit.y) {
                if (nextStage.direction === "left") {
                  this.drawRoad(
                    {
                      x: stage.limit.x - this.mapParams.gridStep,
                      y: y - this.mapParams.gridStep + 12,
                    },
                    this.mapRoadDirections.leftTurnDown,
                    { x: 0, y: this.turnOffset },
                    this.mapParams.gridStep + this.turnOffset,
                    this.mapParams.gridStep + this.turnOffset,
                  );
                } else if (nextStage.direction === "right") {
                  this.drawRoad(
                    {
                      x:
                        prevStage.direction === "right"
                          ? stage.limit.x - this.mapParams.gridStep * 2
                          : stage.limit.x - this.mapParams.gridStep,
                      y: y - this.mapParams.gridStep + this.turnOffset,
                    },
                    this.mapRoadDirections.leftTurnDown,
                    { x: -this.mapParams.gridStep, y: this.turnOffset },
                    this.mapParams.gridStep + this.turnOffset,
                    this.mapParams.gridStep + this.turnOffset,
                  );
                }
              }
              // regular tile
              else {
                // second tile
                if (y === prevStage.limit.y - this.mapParams.gridStep) {
                  this.drawRoad(
                    {
                      x:
                        stage.limit.x -
                        (prevStage.direction === "right"
                          ? this.mapParams.gridStep
                          : 0),
                      y: y - this.mapParams.gridStep - this.turnOffset,
                    },
                    this.mapRoadDirections.down,
                  );
                } else {
                  this.drawRoad(
                    {
                      x:
                        stage.limit.x -
                        (prevStage.direction === "right"
                          ? this.mapParams.gridStep
                          : 0),
                      y: y - this.mapParams.gridStep,
                    },
                    this.mapRoadDirections.down,
                  );
                }
              }
            }
            break;
          }
          default: {
            throw new Error(`Unknown direction type: ${stage.direction}`);
          }
        }
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
