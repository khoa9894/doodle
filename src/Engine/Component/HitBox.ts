import { Component } from './Component';
export class HitBox extends Component implements Engine.IHitBox {
    private pos: IVec2;
    private width: number;
    private height: number;
    private active: boolean;
    constructor(pos: IVec2, width: number, height: number) {
        super();
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.active = true;
    }
    public setPosition(pos: IVec2): void {
        this.pos = pos ;
    }
    public Init(): void {}
    public update(deltaTime: number): void {}
    public getPosX(): number {
        return this.pos.x;
    }
    public render(renderer: Engine.IRenderer, x: number, y: number): void {
   //   if(this.active)  renderer.drawRect(x, y, this.width, this.height);
    }
    public getPosY(): number {
        return this.pos.y;
    }
    public getActive():boolean{
        return this.active
    }
    public setDeActive(hi:boolean) {
        this.active = hi;
    }
    public getWidth(): number {
        return this.width;
    }
    public getHeight(): number {
        return this.height;
    }
    public intersects(other: Engine.IHitBox): boolean {
        if(!this.active) return false;
        return !(
            this.pos.x + this.width < other.getPosX() ||
            this.pos.x > other.getPosX() + other.getWidth() ||
            this.pos.y + this.height < other.getPosY() ||
            this.pos.y > other.getPosY() + other.getHeight()
        );
    }
}