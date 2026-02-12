export declare class CategoryService {
    static getAll(): Promise<any[]>;
    static getById(id: string): Promise<any>;
    static create(name: string): Promise<any>;
    static update(id: string, name: string): Promise<any>;
    static delete(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=category.service.d.ts.map