export enum ScopeType {
  get,
  list,
  create,
  update,
  delete,
}

export interface Scope {
  id: number;
  name: string;
  type: ScopeType;
}
