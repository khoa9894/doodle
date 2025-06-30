import { BoostObject } from "./BoostObject";
import { ResourceManager } from '../../../../Engine/ResourceManager/resourceManage';
import { AudioManager } from "../../../../Engine/ResourceManager/AudioManager";
export class RocketObject extends BoostObject {
    constructor(x: number, y: number, jumpForce: IVec2 = {x: 200, y: -1500}, width: number = 77, height: number = 100) {
        super(x, y, jumpForce, width, height);
    }
    
    protected getTextureName(): string {
        return 'ditconme';
    }
    
    protected getVerticalOffset(): number {
        return -100; 
    }
    
    protected handlePlayerLanding(): void {
        const audioManager = AudioManager.getInstance();
        audioManager.loadSound('jump', 'assets/images/jetpack.mp3');
        audioManager.playSound('jump', 0.8);
        
        setTimeout(() => {
            audioManager.stopSound('jump');
        }, 1000);
    }
}