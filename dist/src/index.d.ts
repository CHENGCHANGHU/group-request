export declare function request<R extends any[] = any[]>({ group, maxRetry, retryDelay, }: IGroupRequestOptions): Promise<R>;
export interface IItem {
    (...args: any[]): Promise<any>;
}
export interface IWrapped {
    (): Promise<void>;
}
export interface IGroupRequestOptions {
    group: Array<IItem>;
    maxRetry?: number;
    retryDelay?: number;
}
