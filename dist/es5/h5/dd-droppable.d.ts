/**
 * dd-droppable.ts 5.0.0-dev
 * Copyright (c) 2021-2022 Alain Dumesny - see GridStack root license
 */
import { DDBaseImplement, HTMLElementExtendOpt } from './dd-base-impl';
export interface DDDroppableOpt {
    accept?: string | ((el: HTMLElement) => boolean);
    drop?: (event: DragEvent, ui: any) => void;
    over?: (event: DragEvent, ui: any) => void;
    out?: (event: DragEvent, ui: any) => void;
}
export declare class DDDroppable extends DDBaseImplement implements HTMLElementExtendOpt<DDDroppableOpt> {
    accept: (el: HTMLElement) => boolean;
    el: HTMLElement;
    option: DDDroppableOpt;
    protected static lastActive: DDDroppable;
    constructor(el: HTMLElement, opts?: DDDroppableOpt);
    on(event: 'drop' | 'dropover' | 'dropout', callback: (event: DragEvent) => void): void;
    off(event: 'drop' | 'dropover' | 'dropout'): void;
    enable(): void;
    disable(forDestroy?: boolean): void;
    destroy(): void;
    updateOption(opts: DDDroppableOpt): DDDroppable;
}
