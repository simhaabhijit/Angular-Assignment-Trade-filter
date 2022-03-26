import { Item } from "./Item";

export interface Stash {
    id: string;
    league: string;
    accountName: string;
    items: Item[]
}