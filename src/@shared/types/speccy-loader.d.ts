import { type OpenAPIObject } from '@nestjs/swagger';

declare module 'speccy/lib/loader' {
  interface LoaderOptions {
    resolve?: boolean;
    jsonSchema?: boolean;
    http?: HTTPOptions;
    cache?: CacheOptions;
  }

  interface HTTPOptions {
    headers?: Record<string, string>;
    timeout?: number;
  }

  interface CacheOptions {
    path?: string;
    algorithm?: string;
    maxEntries?: number;
  }

  export function loadSpec(
    path: string,
    options?: LoaderOptions,
  ): Promise<OpenAPIObject>;
}
