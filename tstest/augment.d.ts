import "./base";
declare module "./base" {
  interface Iface { methodB(): void; }
  class Backend { methodB(): void; }
}
