import { Article } from "./Article";
import { Permission } from "./Permission";

export class UserLogin{
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    token: string;
    permissions: Permission[];
    articles: Article[];
}