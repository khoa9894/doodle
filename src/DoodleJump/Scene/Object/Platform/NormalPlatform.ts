import { Platform } from "./Platform";

export class NormalPlatform extends Platform {
    constructor(x: number, y: number) {
        super(x, y, -500);
    }
    
    public getTextureName(): string {
        return 'platform';
    }
}