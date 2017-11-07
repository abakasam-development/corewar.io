﻿import { ILiteEvent, LiteEvent } from "../modules/LiteEvent";
import { ICore, ICoreAccessEventArgs, CoreAccessType } from "./Interface/ICore";
import { IOptions } from "./Interface/IOptions";
import { IInstruction } from "./Interface/IInstruction";
import { ITask } from "./Interface/ITask";

export class Core implements ICore {

    private _coreAccess: LiteEvent<ICoreAccessEventArgs>;
    public get coreAccess(): ILiteEvent<ICoreAccessEventArgs> {
        return this._coreAccess;
    }
            
    private options: IOptions;
    private instructions: IInstruction[] = null;

    private cs: number;

    constructor() {

        this._coreAccess = new LiteEvent<ICoreAccessEventArgs>();
    }
    
    public initialise(options: IOptions) {

        this.options = options;
        this.cs = this.options.coresize;

        this.allocateMemory();
    }

    public getSize(): number {
        return this.cs;
    }

    public wrap(address: number): number {

        address = address % this.cs;
        address = address >= 0 ? address : address + this.cs;

        return address;
    }

    private triggerEvent(task: ITask, address: number, accessType: CoreAccessType) {

        this._coreAccess.trigger({
            task: task,
            accessType: accessType,
            address: address
        });
    }

    public executeAt(task: ITask, address: number): IInstruction {
        
        address = this.wrap(address);

        this.triggerEvent(task, address, CoreAccessType.execute);

        return this.instructions[address];
    }

    public readAt(task: ITask, address: number): IInstruction {

        address = this.wrap(address);

        this.triggerEvent(task, address, CoreAccessType.read);

        return this.instructions[address];
    }

    public getAt(address: number): IInstruction {

        address = this.wrap(address);

        return this.instructions[address];
    }

    public setAt(task: ITask, address: number, instruction: IInstruction) {

        address = this.wrap(address);

        this.triggerEvent(task, address, CoreAccessType.write);

        this.instructions[address] = instruction;
    }

    private allocateMemory() {
        
        this.instructions = [];
        for (var i = 0; i < this.cs; i++) {
            this.instructions.push(this.buildDefaultInstruction(i));
        }
    }

    private buildDefaultInstruction(index: number): IInstruction {

        var instruction = _.clone(this.options.initialInstruction);
        instruction.aOperand = _.clone(instruction.aOperand);
        instruction.bOperand = _.clone(instruction.bOperand);
        instruction.address = index;

        return instruction;
    }
}