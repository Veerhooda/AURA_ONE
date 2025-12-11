import { NavigationService } from './navigation.service';
export declare class NavigationController {
    private readonly navigationService;
    constructor(navigationService: NavigationService);
    findPath(from: string, to: string): Promise<{
        path: {
            id: number;
            y: number;
            label: string | null;
            x: number;
            floor: number;
            isAccessible: boolean;
            type: string;
        }[];
        distance: number;
    }>;
    getMap(): Promise<{
        nodes: {
            id: number;
            y: number;
            label: string | null;
            x: number;
            floor: number;
            isAccessible: boolean;
            type: string;
        }[];
        edges: {
            id: number;
            weight: number;
            isAccessible: boolean;
            fromId: number;
            toId: number;
        }[];
    }>;
    createNode(data: any): Promise<{
        id: number;
        y: number;
        label: string | null;
        x: number;
        floor: number;
        isAccessible: boolean;
        type: string;
    }>;
    createEdge(data: any): Promise<{
        id: number;
        weight: number;
        isAccessible: boolean;
        fromId: number;
        toId: number;
    }>;
}
