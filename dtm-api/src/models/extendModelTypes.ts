import mongodb from 'mongodb'

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/member-delimiter-style */
declare module 'mongoose' {
    interface Model<T extends Document, QueryHelpers = {}> extends NodeJS.EventEmitter, ModelProperties {
        countDeleted(conditions: any, callback?: (err: any, count: number) => void): Query<number> & QueryHelpers;
        countWithDeleted(conditions: any, callback?: (err: any, count: number) => void): Query<number> & QueryHelpers;

        countDocumentsDeleted(callback?: (err: any, count: number) => void): Query<number> & QueryHelpers;
        countDocumentsDeleted(criteria: any, callback?: (err: any, count: number) => void): Query<number> & QueryHelpers;
        countDocumentsWithDeleted(callback?: (err: any, count: number) => void): Query<number> & QueryHelpers;
        countDocumentsWithDeleted(criteria: any, callback?: (err: any, count: number) => void): Query<number> & QueryHelpers;

        findDeleted(callback?: (err: any, res: T[]) => void): DocumentQuery<T[], T> & QueryHelpers;
        findDeleted(conditions: any, callback?: (err: any, res: T[]) => void): DocumentQuery<T[], T> & QueryHelpers;
        findDeleted(conditions: any, projection?: any | null, callback?: (err: any, res: T[]) => void): DocumentQuery<T[], T> & QueryHelpers;
        findDeleted(conditions: any, projection?: any | null, options?: any | null, callback?: (err: any, res: T[]) => void): DocumentQuery<T[], T> & QueryHelpers;

        findWithDeleted(callback?: (err: any, res: T[]) => void): DocumentQuery<T[], T> & QueryHelpers;
        findWithDeleted(conditions: any, callback?: (err: any, res: T[]) => void): DocumentQuery<T[], T> & QueryHelpers;
        findWithDeleted(conditions: any, projection?: any | null, callback?: (err: any, res: T[]) => void): DocumentQuery<T[], T> & QueryHelpers;
        findWithDeleted(conditions: any, projection?: any | null, options?: any | null, callback?: (err: any, res: T[]) => void): DocumentQuery<T[], T> & QueryHelpers;

        findOneDeleted(conditions?: any, callback?: (err: any, res: T | null) => void): DocumentQuery<T | null, T> & QueryHelpers;
        findOneDeleted(conditions: any, projection: any, callback?: (err: any, res: T | null) => void): DocumentQuery<T | null, T> & QueryHelpers;
        findOneDeleted(conditions: any, projection: any, options: any, callback?: (err: any, res: T | null) => void): DocumentQuery<T | null, T> & QueryHelpers;

        findOneWithDeleted(conditions?: any, callback?: (err: any, res: T | null) => void): DocumentQuery<T | null, T> & QueryHelpers;
        findOneWithDeleted(conditions: any, projection: any, callback?: (err: any, res: T | null) => void): DocumentQuery<T | null, T> & QueryHelpers;
        findOneWithDeleted(conditions: any, projection: any, options: any, callback?: (err: any, res: T | null) => void): DocumentQuery<T | null, T> & QueryHelpers;

        findOneAndUpdateDeleted(): DocumentQuery<T | null, T> & QueryHelpers;
        findOneAndUpdateDeleted(conditions: any, update: any, callback?: (err: any, doc: T | null, res: any) => void): DocumentQuery<T | null, T> & QueryHelpers;
        findOneAndUpdateDeleted(conditions: any, update: any, options: { rawResul: true } & { upsert: true, new: true } & QueryFindOneAndUpdateOptions, callback?: (err: any, doc: mongodb.FindAndModifyWriteOpResultObject<T>, res: any) => void): Query<mongodb.FindAndModifyWriteOpResultObject<T>> & QueryHelpers;
        findOneAndUpdateDeleted(conditions: any, update: any, options: { upsert: true, new: true } & QueryFindOneAndUpdateOptions, callback?: (err: any, doc: T, res: any) => void): DocumentQuery<T, T> & QueryHelpers;
        findOneAndUpdateDeleted(conditions: any, update: any, options: { rawResult: true } & QueryFindOneAndUpdateOptions, callback?: (err: any, doc: mongodb.FindAndModifyWriteOpResultObject<T | null>, res: any) => void): Query<mongodb.FindAndModifyWriteOpResultObject<T | null>> & QueryHelpers;
        findOneAndUpdateDeleted(conditions: any, update: any, options: QueryFindOneAndUpdateOptions, callback?: (err: any, doc: T | null, res: any) => void): DocumentQuery<T | null, T> & QueryHelpers;

        findOneAndUpdateWithDeleted(): DocumentQuery<T | null, T> & QueryHelpers;
        findOneAndUpdateWithDeleted(conditions: any, update: any, callback?: (err: any, doc: T | null, res: any) => void): DocumentQuery<T | null, T> & QueryHelpers;
        findOneAndUpdateWithDeleted(conditions: any, update: any, options: { rawResul: true } & { upsert: true, new: true } & QueryFindOneAndUpdateOptions, callback?: (err: any, doc: mongodb.FindAndModifyWriteOpResultObject<T>, res: any) => void): Query<mongodb.FindAndModifyWriteOpResultObject<T>> & QueryHelpers;
        findOneAndUpdateWithDeleted(conditions: any, update: any, options: { upsert: true, new: true } & QueryFindOneAndUpdateOptions, callback?: (err: any, doc: T, res: any) => void): DocumentQuery<T, T> & QueryHelpers;
        findOneAndUpdateWithDeleted(conditions: any, update: any, options: { rawResult: true } & QueryFindOneAndUpdateOptions, callback?: (err: any, doc: mongodb.FindAndModifyWriteOpResultObject<T | null>, res: any) => void): Query<mongodb.FindAndModifyWriteOpResultObject<T | null>> & QueryHelpers;
        findOneAndUpdateWithDeleted(conditions: any, update: any, options: QueryFindOneAndUpdateOptions, callback?: (err: any, doc: T | null, res: any) => void): DocumentQuery<T | null, T> & QueryHelpers;

        updateDeleted(conditions: any, doc: any, callback?: (err: any, raw: any) => void): Query<any> & QueryHelpers;
        updateDeleted(conditions: any, doc: any, options: ModelUpdateOptions, callback?: (err: any, raw: any) => void): Query<any> & QueryHelpers;

        updateWithDeleted(conditions: any, doc: any, callback?: (err: any, raw: any) => void): Query<any> & QueryHelpers;
        updateWithDeleted(conditions: any, doc: any, options: ModelUpdateOptions, callback?: (err: any, raw: any) => void): Query<any> & QueryHelpers;

        updateManyDeleted(conditions: any, doc: any, callback?: (err: any, raw: any) => void): Query<any> & QueryHelpers;
        updateManyDeleted(conditions: any, doc: any, options: ModelUpdateOptions, callback?: (err: any, raw: any) => void): Query<any> & QueryHelpers;

        updateManyWithDeleted(conditions: any, doc: any, callback?: (err: any, raw: any) => void): Query<any> & QueryHelpers;
        updateManyWithDeleted(conditions: any, doc: any, options: ModelUpdateOptions, callback?: (err: any, raw: any) => void): Query<any> & QueryHelpers;

        delete(conditions: any, deletedBy?: any, callback?: (err: any) => void): Query<any> & QueryHelpers;
        deleteById(id: any | number | string, deletedBy: any, callback?: (err: any) => void): Query<any> & QueryHelpers;
        restore(conditions?: any, callback?: (err: any) => void): Promise<this>;
    }

    interface Document extends MongooseDocument, NodeJS.EventEmitter, ModelProperties {
        delete(deletedBy?: any, callback?: (err: any) => void): Promise<this>;
        restore(callback?: (err: any) => void): Promise<this>;
    }
}
