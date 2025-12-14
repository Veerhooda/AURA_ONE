import { PrismaService } from '../prisma/prisma.service';
export declare class NavigationService {
    private prisma;
    constructor(prisma: PrismaService);
    findPath(fromId: number, toId: number): Promise<{
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
