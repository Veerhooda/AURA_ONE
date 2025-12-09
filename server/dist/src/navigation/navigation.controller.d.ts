import { NavigationService } from './navigation.service';
export declare class NavigationController {
    private readonly navigationService;
    constructor(navigationService: NavigationService);
    findPath(from: string, to: string): Promise<{
        path: {
            label: string | null;
            x: number;
            y: number;
            floor: number;
            isAccessible: boolean;
            type: string;
            id: number;
        }[];
        distance: number;
    }>;
    getMap(): Promise<{
        nodes: {
            label: string | null;
            x: number;
            y: number;
            floor: number;
            isAccessible: boolean;
            type: string;
            id: number;
        }[];
        edges: {
            isAccessible: boolean;
            id: number;
            weight: number;
            fromId: number;
            toId: number;
        }[];
    }>;
    createNode(data: any): Promise<{
        label: string | null;
        x: number;
        y: number;
        floor: number;
        isAccessible: boolean;
        type: string;
        id: number;
    }>;
    createEdge(data: any): Promise<{
        isAccessible: boolean;
        id: number;
        weight: number;
        fromId: number;
        toId: number;
    }>;
}
