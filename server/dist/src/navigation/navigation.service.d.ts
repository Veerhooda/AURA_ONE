import { PrismaService } from '../prisma/prisma.service';
export declare class NavigationService {
    private prisma;
    constructor(prisma: PrismaService);
    findPath(fromId: number, toId: number): Promise<{
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
