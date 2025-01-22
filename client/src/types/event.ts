export interface IEventTarget {
  name: string;
  value: string;
}

export interface ICustomEvent {
  target: IEventTarget;
}
