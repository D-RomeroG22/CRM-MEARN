import { UserDetailsInterface } from "./UserDetailsInterface ";

export interface OptionInterface {
      name: string;
      cost: number;
      category: string;
      user?: string;
      _id?: string;
      message? : string | undefined;
}

export interface OptionWithQuantityInterface extends OptionInterface {
      quantity?: number;
}

export interface OrderInterface {
      date?: Date;
      order?: number;
      list: OptionWithQuantityInterface[];
      user?: string;
      client?: UserDetailsInterface;
      status?: string;
      _id?: string;
}
