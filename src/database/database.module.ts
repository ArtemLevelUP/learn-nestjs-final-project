import { DynamicModule, Module } from '@nestjs/common';
import { createConnection, ConnectionOptions } from "typeorm";
import { Unique } from "../unique";

@Module({
    providers: [{
        provide: 'CONNECTION',
        useValue: createConnection({
            type: 'postgres',
            host: 'localhost',
            port: 5430
        }),

    }, Unique]
})
export class DatabaseModule {
    static register(options: ConnectionOptions): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: 'CONNECTION', // 👈
                    useValue: createConnection(options),
                }
            ]
        }
    }
}
