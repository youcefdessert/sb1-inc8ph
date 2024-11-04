export interface TimeBlock {
    id: string;
    title: string;
    startTime: Date;
    endTime: Date;
    color: string;
    description?: string;
}

export interface Schedule {
    id: string;
    name: string;
    blocks: TimeBlock[];
}