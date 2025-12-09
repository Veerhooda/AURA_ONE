import { PrismaService } from '../prisma/prisma.service';
export declare class NavigationService {
    private prisma;
    constructor(prisma: PrismaService);
    findPath(fromId: number, toId: number): Promise<{
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
