---
layout: doc

title: \@kubb/swagger-zodios
outline: deep
---

# @kubb/swagger-zodios <a href="https://paka.dev/npm/@kubb/swagger-zodios@latest/api">🦙</a>

With the Swagger zodios plugin you can use [zodios](https://github.com/ecyrbe/zodios) to validate your schema's based on a Swagger file.

## Installation

::: code-group

```shell [bun <img src="/feature/bun.svg"/>]
bun add @kubb/swagger-zodios @kubb/swagger-zod @kubb/swagger
```

```shell [pnpm <img src="/feature/pnpm.svg"/>]
pnpm add @kubb/swagger-zodios @kubb/swagger-zod @kubb/swagger
```

```shell [npm <img src="/feature/npm.svg"/>]
npm install @kubb/swagger-zodios @kubb/swagger-zod @kubb/swagger
```

```shell [yarn <img src="/feature/yarn.svg"/>]
yarn add @kubb/swagger-zodios @kubb/swagger-zod @kubb/swagger
```

:::

## Options

### output

#### output.path

Output to save the zodios instance. <br/>
Output should be a file(ending with .ts or .js).

::: info

Type: `string` <br/>
Default: `'zodios.ts'`

::: code-group

```typescript [kubb.config.js]
import { defineConfig } from '@kubb/swagger'
import createSwagger from '@kubb/swagger'
import createSwaggerZod from '@kubb/swagger-zod'
import createSwaggerZodios from '@kubb/swagger-zodios'

export default defineConfig({
  input: {
    path: './petStore.yaml',
  },
  output: {
    path: './src/gen',
  },
  plugins: [
    createSwagger({ output: false }),
    createSwaggerZod({}),
    createSwaggerZodios(
      {
        output: {
          path: 'zodios.ts',
        },
      },
    ),
  ],
})
```

:::

#### output.exportAs

Name to be used for the `export * as {{exportAs}} from './'`

::: info
Type: `string` <br/>

::: code-group

```typescript [kubb.config.js]
import { defineConfig } from '@kubb/swagger'
import createSwagger from '@kubb/swagger'
import createSwaggerZod from '@kubb/swagger-zod'
import createSwaggerZodios from '@kubb/swagger-zodios'

export default defineConfig({
  input: {
    path: './petStore.yaml',
  },
  output: {
    path: './src/gen',
  },
  plugins: [
    createSwagger({ output: false }),
    createSwaggerZod({}),
    createSwaggerZodios(
      {
        output: {
          exportAs: 'zodios',
        },
      },
    ),
  ],
})
```

:::

#### output.extName

Add an extension to the generated imports and exports, default it will not use an extension

::: info
Type: `string` <br/>

::: code-group

```typescript [kubb.config.js]
import { defineConfig } from '@kubb/swagger'
import createSwagger from '@kubb/swagger'
import createSwaggerZod from '@kubb/swagger-zod'
import createSwaggerZodios from '@kubb/swagger-zodios'

export default defineConfig({
  input: {
    path: './petStore.yaml',
  },
  output: {
    path: './src/gen',
  },
  plugins: [
    createSwagger({ output: false }),
    createSwaggerZod({}),
    createSwaggerZodios(
      {
        output: {
          extName: '.js',
        },
      },
    ),
  ],
})
```

:::

## Depended

- [`@kubb/swagger`](/plugins/swagger)
- [`@kubb/swagger-zod`](/plugins/swagger-zod)

## Links

- [zodios](https://github.com/ecyrbe/zodios)
