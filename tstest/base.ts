export interface Iface { methodA(): void; }
export class Backend implements Iface { methodA() {} }
export function createActor(): Backend { return new Backend(); }
