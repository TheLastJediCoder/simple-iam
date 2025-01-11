enum type {
  read,
  create,
  update,
  delete,
}

export interface Scope {
  id: number;
  name: string;
  type: type;
}
