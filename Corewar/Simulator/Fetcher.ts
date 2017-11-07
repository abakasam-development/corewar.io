﻿import { IFetcher } from "./Interface/IFetcher";
import { IState } from "./Interface/IState";
import { IExecutionContext } from "./Interface/IExecutionContext";

export class Fetcher implements IFetcher {

    public fetch(state: IState): IExecutionContext {

        var wi = state.warriorIndex;
        var warrior = state.warriors[wi];

        var ti = warrior.taskIndex;
        var task = warrior.tasks[ti];

        state.warriorIndex = (wi + 1) % state.warriors.length;
        warrior.taskIndex = (ti + 1) % warrior.tasks.length;

        var ip = task.instructionPointer;
        var instruction = state.core.executeAt(task, ip);

        task.instructionPointer = (ip + 1) % state.options.coresize;
        // TODO should we instantiate an object everytime?
        return {
            core: state.core,
            instructionPointer: ip,
            instruction: instruction,
            taskIndex: ti,
            task: task,
            warriorIndex: wi,
            warrior: warrior
        };
    }
}
 