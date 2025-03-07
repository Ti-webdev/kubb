import type { PossiblePromise } from '@kubb/types'
import type { FileManager, KubbFile } from './FileManager.ts'
import type { OptionsPlugins, PluginUnion } from './index.ts'
import type { PluginManager } from './PluginManager.ts'
import type { Cache } from './utils/cache.ts'
import type { Logger, LogLevel } from './utils/logger.ts'

// config

/**
 * Config used in `kubb.config.js`
 *
 * @example import { defineConfig } from '@kubb/core'
 * export default defineConfig({
 * ...
 * })
 */
export type KubbUserConfig =
  & Omit<KubbConfig, 'root' | 'plugins'>
  & {
    /**
     * Project root directory. Can be an absolute path, or a path relative from
     * the location of the config file itself.
     * @default process.cwd()
     */
    root?: string
    /**
     * Plugin type can be KubbJSONPlugin or KubbPlugin
     * Example: ['@kubb/swagger', { output: false }]
     * Or: createSwagger({ output: false })
     */
    plugins?: Array<Omit<UnknownKubbUserPlugin, 'api'> | KubbUnionPlugins | [name: string, options: object]>
  }

export type InputPath = {
  /**
   * Path to be used as the input. This can be an absolute path or a path relative to the `root`.
   */
  path: string
}

export type InputData = {
  /**
   * `string` or `object` containing the data.
   */
  data: string | unknown
}

type Input = InputPath | InputData

/**
 * @private
 */
export type KubbConfig<TInput = Input> = {
  /**
   * Optional config name to show in CLI output
   */
  name?: string
  /**
   * Project root directory. Can be an absolute path, or a path relative from
   * the location of the config file itself.
   * @default process.cwd()
   */
  root: string
  input: TInput
  output: {
    /**
     * Path to be used to export all generated files.
     * This can be an absolute path, or a path relative based of the defined `root` option.
     */
    path: string
    /**
     * Clean output directory before each build.
     */
    clean?: boolean
    /**
     * Write files to the fileSystem
     * This is being used for the playground.
     * @default true
     */
    write?: boolean
  }
  /**
   * Array of Kubb plugins to use.
   * The plugin/package can forsee some options that you need to pass through.
   * Sometimes a plugin is depended on another plugin, if that's the case you will get an error back from the plugin you installed.
   */
  plugins?: Array<KubbPlugin>
  /**
   * Hooks that will be called when a specific action is triggered in Kubb.
   */
  hooks?: {
    /**
     * Hook that will be triggered at the end of all executions.
     * Useful for running Prettier or ESLint to format/lint your code.
     */
    done?: string | Array<string>
  }
}

export type CLIOptions = {
  /**
   * Path to `kubb.config.js`
   */
  config?: string
  /**
   * Watch changes on input
   */
  watch?: string

  /**
   * Log level to report when using the CLI
   *
   * `silent` will hide all information that is not relevant
   *
   * `info` will show all information possible(not related to the PluginManager)
   *
   * `debug` will show all information possible(related to the PluginManager), handy for seeing logs
   * @default `silent`
   */
  logLevel?: LogLevel
}

// plugin

export type KubbUnionPlugins = PluginUnion

export type KubbObjectPlugin = keyof OptionsPlugins

export type PluginFactoryOptions<
  /**
   * Name to be used for the plugin, this will also be used for they key.
   */
  TName extends string = string,
  /**
   * Options of the plugin.
   */
  TOptions extends object = object,
  /**
   * Options of the plugin that can be used later on, see `options` inside your plugin config.
   */
  TResolvedOptions extends object = TOptions,
  /**
   * API that you want to expose to other plugins.
   */
  TAPI = any,
  /**
   * When calling `resolvePath` you can specify better types.
   */
  TResolvePathOptions extends object = object,
  /**
   * When using @kubb/react(based on React) you can specify here which types should be used when calling render.
   * Always extend from `AppMeta` of the core.
   */
  TAppMeta = unknown,
> = {
  name: TName
  /**
   * Same behaviour like what has been done with `QueryKey` in `@tanstack/react-query`
   */
  key: [name: TName | string, identifier?: string | number]
  options: TOptions
  resolvedOptions: TResolvedOptions
  api: TAPI
  resolvePathOptions: TResolvePathOptions
  appMeta: {
    pluginManager: PluginManager
    plugin: KubbPlugin<PluginFactoryOptions<TName, TOptions, TResolvedOptions, TAPI, TResolvePathOptions, TAppMeta>>
  } & TAppMeta
}

export type GetPluginFactoryOptions<TPlugin extends KubbUserPlugin> = TPlugin extends KubbUserPlugin<infer X> ? X : never

export type KubbUserPlugin<TOptions extends PluginFactoryOptions = PluginFactoryOptions> =
  & {
    /**
     * Unique name used for the plugin
     * The name of the plugin follows the format scope:foo-bar or foo-bar, adding scope: can avoid naming conflicts with other plugins.
     * @example @kubb/typescript
     */
    name: TOptions['name']
    /**
     * Options set for a specific plugin(see kubb.config.js), passthrough of options.
     */
    options: TOptions['resolvedOptions']
    /**
     * Specifies the preceding plugins for the current plugin. You can pass an array of preceding plugin names, and the current plugin will be executed after these plugins.
     * Can be used to validate depended plugins.
     */
    pre?: Array<string>
    /**
     * Specifies the succeeding plugins for the current plugin. You can pass an array of succeeding plugin names, and the current plugin will be executed before these plugins.
     */
    post?: Array<string>
  }
  & (TOptions['api'] extends never ? {
      api?: never
    }
    : {
      api: (this: TOptions['name'] extends 'core' ? null : Omit<PluginContext<TOptions>, 'addFile'>) => TOptions['api']
    })

export type KubbUserPluginWithLifeCycle<TOptions extends PluginFactoryOptions = PluginFactoryOptions> = KubbUserPlugin<TOptions> & PluginLifecycle<TOptions>

type UnknownKubbUserPlugin = KubbUserPlugin<PluginFactoryOptions<any, any, any, any, any, any>>

export type KubbPlugin<TOptions extends PluginFactoryOptions = PluginFactoryOptions> =
  & {
    /**
     * Unique name used for the plugin
     * @example @kubb/typescript
     */
    name: TOptions['name']
    /**
     * Internal key used when a developer uses more than one of the same plugin
     * @private
     */
    key: TOptions['key']
    /**
     * Specifies the preceding plugins for the current plugin. You can pass an array of preceding plugin names, and the current plugin will be executed after these plugins.
     * Can be used to validate depended plugins.
     */
    pre?: Array<string>
    /**
     * Specifies the succeeding plugins for the current plugin. You can pass an array of succeeding plugin names, and the current plugin will be executed before these plugins.
     */
    post?: Array<string>
    /**
     * Options set for a specific plugin(see kubb.config.js), passthrough of options.
     */
    options: TOptions['resolvedOptions']
    /**
     * Define an api that can be used by other plugins, see `PluginManager' where we convert from `KubbUserPlugin` to `KubbPlugin`(used when calling `createPlugin`).
     */
  }
  & (TOptions['api'] extends never ? {
      api?: never
    }
    : {
      api: TOptions['api']
    })

export type KubbPluginWithLifeCycle<TOptions extends PluginFactoryOptions = PluginFactoryOptions> = KubbPlugin<TOptions> & PluginLifecycle<TOptions>

export type PluginLifecycle<TOptions extends PluginFactoryOptions = PluginFactoryOptions> = {
  /**
   * Start of the lifecycle of a plugin.
   * @type hookParallel
   */
  buildStart?: (this: PluginContext<TOptions>, kubbConfig: KubbConfig) => PossiblePromise<void>
  /**
   * Resolve to a Path based on a baseName(example: `./Pet.ts`) and directory(example: `./models`).
   * Options can als be included.
   * @type hookFirst
   * @example ('./Pet.ts', './src/gen/') => '/src/gen/Pet.ts'
   */
  resolvePath?: (this: PluginContext<TOptions>, baseName: string, directory?: string, options?: TOptions['resolvePathOptions']) => KubbFile.OptionalPath
  /**
   * Resolve to a name based on a string.
   * Useful when converting to PascalCase or camelCase.
   * @type hookFirst
   * @example ('pet') => 'Pet'
   */
  resolveName?: (this: PluginContext<TOptions>, name: ResolveNameParams['name'], type?: ResolveNameParams['type']) => string
  /**
   * Makes it possible to run async logic to override the path defined previously by `resolvePath`.
   * @type hookFirst
   */
  load?: (this: Omit<PluginContext<TOptions>, 'addFile'>, path: KubbFile.Path) => PossiblePromise<TransformResult | null>
  /**
   * Transform the source-code.
   * @type hookReduceArg0
   */
  transform?: (this: Omit<PluginContext<TOptions>, 'addFile'>, source: string, path: KubbFile.Path) => PossiblePromise<TransformResult>
  /**
   * Write the result to the file-system based on the id(defined by `resolvePath` or changed by `load`).
   * @type hookParallel
   */
  writeFile?: (this: Omit<PluginContext<TOptions>, 'addFile'>, source: string | undefined, path: KubbFile.Path) => PossiblePromise<string | void>
  /**
   * End of the plugin lifecycle.
   * @type hookParallel
   */
  buildEnd?: (this: PluginContext<TOptions>) => PossiblePromise<void>
}

export type PluginLifecycleHooks = keyof PluginLifecycle

export type PluginParameter<H extends PluginLifecycleHooks> = Parameters<Required<PluginLifecycle>[H]>

export type PluginCache = Record<string, [number, unknown]>

export type ResolvePathParams<TOptions = object> = {
  pluginKey?: KubbPlugin['key']
  baseName: string
  directory?: string | undefined
  /**
   * Options to be passed to 'resolvePath' 3th parameter
   */
  options?: TOptions
}

export type ResolveNameParams = {
  name: string
  pluginKey?: KubbPlugin['key']
  /**
   * `file` will be used to customize the name of the created file(use of camelCase)
   * `function` can be used used to customize the exported functions(use of camelCase)
   * `type` is a special type for TypeScript(use of PascalCase)
   */
  type?: 'file' | 'function' | 'type'
}

export type PluginContext<TOptions extends PluginFactoryOptions = PluginFactoryOptions> = {
  config: KubbConfig
  cache: Cache<PluginCache>
  fileManager: FileManager
  pluginManager: PluginManager
  addFile: (...file: Array<KubbFile.File>) => Promise<Array<KubbFile.File>>
  resolvePath: (params: ResolvePathParams<TOptions['resolvePathOptions']>) => KubbFile.OptionalPath
  resolveName: (params: ResolveNameParams) => string
  logger: Logger
  /**
   * All plugins
   */
  plugins: KubbPlugin[]
  /**
   * Current plugin
   */
  plugin: KubbPlugin<TOptions>
}

// null will mean clear the watcher for this key
export type TransformResult = string | null
