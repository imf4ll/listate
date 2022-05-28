export interface ProgressBarProps {
    progress: number;
}

export interface IItem {
    item: string;
    quantity: number;
    total: number;
    checked: boolean;
    id: number;
}

export interface ITask {
    id: string;
    task: {
        items: IItem[],
        name: string
    };
    timestamp: string;
    observation: string;
}

export interface ITaskSingle {
    id: string;
    timestamp?: string;
    observation?: string;
    items: IItem[];
    name: string;
}

export interface ITemplate {
    name: string;
    items: IItem[];
    id: string;
}
