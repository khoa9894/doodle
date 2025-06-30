import { Physic2D } from './../Component/Physic2D';
export class GameObject  {
    private _position: IVec2;
    private _size: { width: number; height: number };
    private _active: boolean;
    private image: HTMLImageElement
    protected _listComponent:Engine.IComponent[] = [];

    constructor( position: IVec2, size: { width: number; height: number }){
        this._position = position;
        this._size = size;
        this._active = true;
    }
    public AddImage(image: HTMLImageElement){
        this.image=image;
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
    public activePhysic2d(hi:boolean):void{
        const Physic2D=this.getComponent<Engine.IPhysic2D>('Physic2D');
        if(Physic2D){
            Physic2D.setReverse(hi)
        }
    }
    public activeHitbox(hi:boolean):void{
         const hitbox = this.getComponent<Engine.IHitBox>('HitBox');
         if (hitbox) {
        hitbox.setDeActive(hi);  
    }
    }
    public Update(deltaTime: number): void {
        if (!this._active) return;
         const hitbox = this.getComponent<Engine.IHitBox>('HitBox');
         if (hitbox) {
        hitbox.setPosition(this._position);  
    }
        for (const component of this._listComponent) {
            if (component.update) {
                component.update(deltaTime);
            }
        }
    }   
    public setSize( size:{width: number, height: number}):void{
        this._size=size
    }
     public Render(renderer: Engine.IRenderer): void {
        if(this.image) renderer.render(this.image, this.position.x, this.position.y);
            for (const component of this._listComponent) {
                component.render(renderer, this.position.x, this.position.y);
            }
        }
    public getComponent<T extends Engine.IComponent>(typeName: string): T | null {
    for (const component of this._listComponent) {
        if (component.constructor.name === typeName) {
            return component as T;
        }
    }
    return null;
}
    public getAnimation(): Engine.IComponent | null {
        return this.getComponent('Animation');
    }
    
    public getPhysics(): Engine.IComponent | null {
        return this.getComponent('Physic2D');
    }
    
    public getHitBox(): Engine.IComponent | null {
        return this.getComponent('HitBox');
    }

    // Debug method to check all components
    public getComponentNames(): string[] {
        return this._listComponent.map(c => c.constructor.name);
    }

    get position():  IVec2  {
        return this._position;
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