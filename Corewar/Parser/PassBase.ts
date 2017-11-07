﻿import { IPass } from "./Interface/IPass";
import { IContext } from "./Interface/IContext";
import { ITokenStream } from "./Interface/ITokenStream";
import { IParseOptions } from "./Interface/IParseOptions";

import { TokenStream } from "./TokenStream";

export class PassBase implements IPass {

    protected context: IContext;
    protected stream: ITokenStream;
    protected options: IParseOptions;
    
    public process(context: IContext, options: IParseOptions): IContext {

        // TODO CONSTANTS - need to define core settings at compile time
        // TODO P-Space
        // TODO ;redcode tags
        // TODO stringify and FOR variables
        // TODO loader should check against run options e.g. no P-space etc.

        this.context = context;
        this.stream = new TokenStream(context.tokens, context.messages);
        this.context.tokens = [];
        this.options = options;

        this.processLines();

        return this.context;
    }

    private processLines() {

        while (!this.stream.eof()) {

            try {
                this.processLine();
            } catch (err) {
                this.stream.readToEOL();
            }
        }
    }

    protected processLine() {

        throw new Error("PassBase.processLine is an Abstract Method");
    }
} 