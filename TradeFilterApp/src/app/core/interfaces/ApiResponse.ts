import { Stash } from "./Stash";

export interface ApiResponse {
    next_change_id: string;
    stashes: Stash[]
}