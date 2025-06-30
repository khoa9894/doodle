import { Platform } from "./Platform";
import { AudioManager } from "../../../../Engine/ResourceManager/AudioManager";
export class SpringPlatform extends Platform {
    constructor(x: number, y: number) {
        super(x, y, -1000); 
        console.log('spring', x, y)
    }
    
    protected getTextureName(): string {
        return 'spring';
    }
    
    protected handlePlayerLanding(): void {
            const audioManager = AudioManager.getInstance();
                audioManager.loadSound('jump', 'assets/images/spring.mp3');
                audioManager.playSound('jump', 0.8)
        }
}