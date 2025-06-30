import { Platform } from "./Platform";
import { ResourceManager } from '../../../../Engine/ResourceManager/resourceManage';
import { AudioManager } from "../../../../Engine/ResourceManager/AudioManager";
export class NormalPlatform extends Platform {
    constructor(x: number, y: number) {
        super(x, y, -500);
      //  console.log('normal', this.position)
    }
    
    public getTextureName(): string {
        return 'platform';
    }
    protected handlePlayerLanding(): void {
        const audioManager = AudioManager.getInstance();
            audioManager.loadSound('jump', 'assets/images/jump.mp3');
            audioManager.playSound('jump', 0.8)
    }
}