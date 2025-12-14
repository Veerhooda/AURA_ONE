import { NavigationService } from './navigation.service';
export declare class NavigationController {
    private readonly navigationService;
    constructor(navigationService: NavigationService);
    findPath(from: string, to: string): Promise<{
        path: {
            id: number;
            type: string;
            label: string | null;
            x: number;
            y: number;
            floor: number;
            isAccessible: boolean;
        }[];
        distance: number;
    }>;
    getMap(): Promise<{
        nodes: {
            id: number;
            type: string;
            label: string | null;
            x: number;
            y: number;
            floor: number;
            isAccessible: boolean;
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
        type: string;
        label: string | null;
        x: number;
        y: number;
        floor: number;
        isAccessible: boolean;
    }>;
    createEdge(data: any): Promise<{
        id: number;
        weight: number;
        isAccessible: boolean;
        fromId: number;
        toId: number;
    }>;
}
