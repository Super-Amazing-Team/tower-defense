import { TPartialRecord } from "@/pages/Game/engine/TDEngine";

export type TSoundType = "gameStart" | "enemyHit" | "gameEnded" | "waveEnded";
export interface ISound {
  context: HTMLAudioElement;
  buffer: AudioBuffer | null;
  soundArr: TPartialRecord<TSoundType, HTMLAudioElement>;
  soundSourceArr: TPartialRecord<TSoundType, string>;
  isInitialized: boolean;
}
export class Sound {
  constructor(
    public context: ISound["context"] | undefined = typeof window === "object"
      ? document.createElement("audio")
      : undefined,
    public soundSourceArr: ISound["soundSourceArr"] = {
      gameStart: "/sound/gameStart.mp3",
    },
    public soundArr: ISound["soundArr"] = {},
    public isInitialized: ISound["isInitialized"] = false,
  ) {
    for (const [soundType, soundSource] of Object.entries(
      this.soundSourceArr,
    )) {
      const soundSample =
        typeof window === "object" ? new Audio(soundSource) : undefined;
      if (soundSample) {
        soundSample.oncanplay = () => {
          this.soundArr[soundType as TSoundType] = soundSample;
        };
        if (soundType === "gameStart") {
          soundSample.loop = true;
        }
      }
    }
  }
}
