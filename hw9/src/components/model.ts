export type Message = {
    text: string;
    username: string;
};

export type User = {
    name: string;
    room: string;
};

export type UserEvent = {
    numUsers: number;
    username: string;
}

export type ImageT = {
    username: string;
    body: string,
}