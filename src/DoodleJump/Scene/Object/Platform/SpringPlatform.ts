import { Platform } from "./Platform";

export class SpringPlatform extends Platform {
    constructor(x: number, y: number) {
        super(x, y, -1000); 
    }
    
    protected getTextureName(): string {
        return 'spring';
    }
    
    protected handlePlayerLanding(): void {
        console.log('Spring bounce!');
    }
}