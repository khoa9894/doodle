import { HitBox } from '../Component/HitBox';
export class GameObject  {
    private _position: IVec2;
    private _size: { width: number; height: number };
    private _active: boolean;
    private image: HTMLImageElement
    private _listComponent:Engine.IComponent[] = [];
    private HitBox: HitBox;

    constructor( position: IVec2, size: { width: number; height: number }){
        this._position = position;
        this._size = size;
        this._active = true;
        this.HitBox = new HitBox(position,size.width,size.height)
        this.AddComponent(this.HitBox)
    }
    public AddImage(image: HTMLImageElement){
        this.image=image;
    }
    public SetCollision(){
        this.HitBox.setDeActive()
    }
    public AddComponent(cpn: Engine.IComponent) {
        const find = this._listComponent.find(c => c.constructor.name === cpn.constructor.name);
        if (find) {
            throw new Error('co roi');
        } else {
            this._listComponent.push(cpn);
        }
    }
    public setPosition(pos: IVec2): void {
        this._position = pos ;
    }
    public Update(deltaTime: number): void {
        if (!this._active) return;
        this.setPosition({x:this.hitbox.getPosX(), y:this.hitbox.getPosY()})
        for (const component of this._listComponent) {
            if (component.update) {
                component.update(deltaTime);
            }
        }
    }   
     public Render(renderer: Engine.IRenderer): void {
        if(this.image) renderer.render(this.image, this.hitbox.getPosX(),  this.hitbox.getPosY());
            for (const component of this._listComponent) {
                if (component.render) {
                    component.render(renderer, this.HitBox.getPosX(), this.HitBox.getPosY());
                }
            }
        }
    public getComponentByName(name: string) {
        const found = this._listComponent.find(c => c.constructor.name === name);
        if (!found) {
            throw new Error('deo co');
        }
        return found;
    }
    get position(): { x: number; y: number } {
        return this._position;
    }
    get hitbox(): HitBox {
        return this.HitBox;
    }
    get size(): { width: number; height: number } {
        return this._size;
    }
   
    get active(): boolean {
        return this._active;
    }

    set active(value: boolean) {
        this._active = value;
    }
}