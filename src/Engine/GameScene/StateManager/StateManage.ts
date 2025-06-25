//import { StateManage } from './StateManage';
import { GameStateBase, StateTypes } from "./gameStateBase";
import { createState } from "./gameStateFactory";

export class StateManage {
    private static instance: StateManage
    private stack: GameStateBase[] = [];
    private currentState: GameStateBase | null = null;
    private nextState: GameStateBase | null = null;
    private isRunning: boolean = true;

    private constructor() {}

    public changeState(state: GameStateBase) {
        this.nextState = state;
    }
    public static getInstance(): StateManage {
        if (!StateManage.instance) {
            StateManage.instance = new StateManage();
        }
        return StateManage.instance;
    }
    public changeStateByType(type: StateTypes) {
        const gs = createState(type);
        this.changeState(gs);
    }

    public pushState(type: StateTypes) {
        const gs = createState(type);
        if (this.stack.length > 0) {
            this.stack[this.stack.length - 1].pause();
        }
        this.nextState = gs;
    }

    public popState() {
        if (this.stack.length > 0) {
            this.stack[this.stack.length - 1].exit();
            this.stack.pop();
        }
        if (this.stack.length > 0) {
            this.stack[this.stack.length - 1].resume();
        }
        this.currentState = this.stack[this.stack.length - 1] || null;
    }

    public performStateChange() {
        if (this.nextState) {
            if (this.stack.length > 0) {
                this.stack[this.stack.length - 1].exit();
            }
            this.stack.push(this.nextState);
            this.stack[this.stack.length - 1].init();
            this.currentState = this.nextState;
            this.nextState = null;
        }
    }

    public needToChangeState(): boolean {
        return this.nextState !== null;
    }

    public getCurrentState(): GameStateBase | null {
        return this.currentState;
    }

    public getNextState(): GameStateBase | null {
        return this.nextState;
    }

    public hasState(): boolean {
        return this.stack.length > 0;
    }
}