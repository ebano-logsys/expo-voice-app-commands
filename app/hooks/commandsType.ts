export interface Command {
    key: string;
    callback: () => void;
    response: string
}