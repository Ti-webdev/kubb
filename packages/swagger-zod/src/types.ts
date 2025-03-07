import type { KubbFile, KubbPlugin, PluginFactoryOptions, ResolveNameParams } from '@kubb/core'
import type { AppMeta as SwaggerAppMeta, Exclude, Include, Override, ResolvePathOptions } from '@kubb/swagger'

export type Options = {
  output?: {
    /**
     * Relative path to save the Zod schemas.
     * When output is a file it will save all models inside that file else it will create a file per schema item.
     * @default 'zod'
     */
    path: string
    /**
     * Name to be used for the `export * as {{exportAs}} from './'`
     */
    exportAs?: string
    /**
     * Add an extension to the generated imports and exports, default it will not use an extension
     */
    extName?: KubbFile.Extname
  }
  /**
   * Group the Zod schemas based on the provided name.
   */
  group?: {
    /**
     * Tag will group based on the operation tag inside the Swagger file
     */
    type: 'tag'
    /**
     * Relative path to save the grouped Zod schemas.
     *
     * `{{tag}}` will be replaced by the current tagName.
     * @example `${output}/{{tag}}Controller` => `zod/PetController`
     * @default `${output}/{{tag}}Controller`
     */
    output?: string
    /**
     * Name to be used for the `export * as {{exportAs}} from './`
     * @default `"{{tag}}Schemas"`
     */
    exportAs?: string
  }
  /**
   * Array containing exclude paramaters to exclude/skip tags/operations/methods/paths.
   */
  exclude?: Array<Exclude>
  /**
   * Array containing include paramaters to include tags/operations/methods/paths.
   */
  include?: Array<Include>
  /**
   * Array containing override paramaters to override `options` based on tags/operations/methods/paths.
   */
  override?: Array<Override<Options>>
  transformers?: {
    /**
     * Customize the names based on the type that is provided by the plugin.
     */
    name?: (name: ResolveNameParams['name'], type?: ResolveNameParams['type']) => string
  }
}

type ResolvedOptions = {
  transformers: NonNullable<Options['transformers']>
  exclude: Options['exclude']
  include: Options['include']
  override: Options['override']
}

export type FileMeta = {
  pluginKey?: KubbPlugin['key']
  tag?: string
}
type AppMeta = SwaggerAppMeta

export type PluginOptions = PluginFactoryOptions<'swagger-zod', Options, ResolvedOptions, never, ResolvePathOptions, AppMeta>

declare module '@kubb/core' {
  export interface _Register {
    ['@kubb/swagger-zod']: PluginOptions
  }
}
