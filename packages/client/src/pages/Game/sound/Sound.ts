import { TPartialRecord } from "@/pages/Game/engine/TDEngine";

export type TSoundType = "gameStart" | "enemyHit" | "gameEnded" | "waveEnded";
export interface ISound {
  context: HTMLAudioElement;
  buffer: AudioBuffer | null;
  soundArr: TPartialRecord<TSoundType, HTMLAudioElement>;
  soundSourceArr: TPartialRecord<TSoundType, string>;
  isInitialized: boolean;
}
class Sound {
  constructor(
    public context: ISound["context"] = document.createElement("audio"),
    public soundSourceArr: ISound["soundSourceArr"] = {
      gameStart: "/sound/gameStart.mp3",
    },
    public soundArr: ISound["soundArr"] = {},
    public isInitialized: ISound["isInitialized"] = false,
  ) {
    for (const [soundType, soundSource] of Object.entries(
      this.soundSourceArr,
    )) {
      const soundSample = new Audio(soundSource);
      soundSample.oncanplay = () => {
        this.soundArr[soundType as TSoundType] = soundSample;
      };
      if (soundType === "gameStart") {
        soundSample.loop = true;
      }
    }
  }
}

export default Sound;
