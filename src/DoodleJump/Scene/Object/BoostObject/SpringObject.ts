import { BoostObject } from "./BoostObject";
import { ResourceManager } from '../../../../Engine/ResourceManager/resourceManage';
import { AudioManager } from "../../../../Engine/ResourceManager/AudioManager";
export class SpringObject extends BoostObject {
    constructor(x: number, y: number, jumpForce: IVec2 = {x: 200, y: -1000}, width: number = 77, height: number = 32) {
        super(x, y, jumpForce, width, height);
    }
    
    protected getTextureName(): string {
        return 'dicho';
    }
    
    protected getVerticalOffset(): number {
        return -20; // Spring offset
    }
    
    protected handlePlayerLanding(): void {
          const audioManager = AudioManager.getInstance();
                                audioManager.loadSound('jump', 'assets/images/spring.mp3');
                                audioManager.playSound('jump', 0.8)
    }
}