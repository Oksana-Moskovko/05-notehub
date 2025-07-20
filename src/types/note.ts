export interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    tag: string;
}

export interface NoteTag {
    message: string;
}