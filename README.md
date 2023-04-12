# vue-reuse-template

[![NPM version](https://img.shields.io/npm/v/vue-reuse-template?color=a1b858&label=)](https://www.npmjs.com/package/vue-reuse-template)

Define and reuse Vue template inside the component scope.

## Install

```bash
pnpm i vue-reuse-template
```

## Motivation

It's common to have the need to reuse some part of the template in Vue. For example:

```html
<template>
  <dialog v-if="showInDialog">
    <!-- something complex -->
  </dialog>
  <div v-else>
    <!-- something complex -->
  </div>
</template>
```

We'd like to reuse our code as much as possible. So normally we might need to extract those duplicated parts into a component. However, in a seperated component you lose the ability to access the local bindings. Defining props and emits for them can be tedious sometime.

So this library provides a way to define and use templates inside the component scope.

## Usage

In the previous example, we could refactor it to:

```html
<script setup>
import { DefineTemplate, ReuseTemplate } from 'vue-reuse-template'
</script>

<template>
  <DefineTemplate name="some-key">
    <!-- something complex -->
  </DefineTemplate>

  <dialog v-if="showInDialog">
    <ReuseTemplate name="some-key" />
  </dialog>
  <div v-else>
    <ReuseTemplate name="some-key" />
  </div>
</template>
```

- `<DefineTemplate>` will register the template and renders nothing.
- `<ReuseTemplate>` will render the template provided by `DefineTemplate` with the same name.

### Passing Data

You can also pass data to the template using slots:

- Use `v-slot="..."` to access the data on `<DefineTemplate>`
- Directly bind the data on `<ReuseTemplate>` to pass them to the template

```html
<script setup>
import { DefineTemplate, ReuseTemplate } from 'vue-reuse-template'
</script>

<template>
  <DefineTemplate name="some-key" v-slot="{ data, msg, anything }">
    <!-- something complex -->
    <div>{{ data }} passed from usage</div>
  </DefineTemplate>

  <dialog v-if="showInDialog">
    <ReuseTemplate name="some-key" :data="data" msg="I am in a dialog" />
  </dialog>
  <div v-else>
    <ReuseTemplate name="some-key" :data="anotherData" msg="I am inline!" />
  </div>
</template>
```

### TypeScript Support

You can use `createReusableTemplate` to create a reusable template with type support:

```html
<script setup>
import { createReusableTemplate } from 'vue-reuse-template'

// Comes with pair of `DefineTemplate` and `ReuseTemplate`
const [DefineFoo, ReuseFoo] = createReusableTemplate<{ msg: string }>()

// You can create multiple reusable templates
const [DefineBar, ReuseBar] = createReusableTemplate<{ items: string[] }>()
</script>

<template>
  <!-- With `createReusableTemplate` you don't need to set `name` -->
  <DefineFoo v-slot="{ msg }">
    <!-- `msg` is typed as `string` -->
    <div>Hello {{ msg.toUpperCase() }}</div>
  </DefineFoo>

  <ReuseFoo msg="World" />

  <!-- @ts-expect-error Type Error! -->
  <ReuseFoo :msg="1" />
</template>
```

Optionally, if you are not a fan of array destructuring, the following usage is also legal:

```html
<script setup>
import { createReusableTemplate } from 'vue-reuse-template'

const TemplateFoo = createReusableTemplate<{ msg: string }>()
</script>

<template>
  <!-- With `createReusableTemplate` you don't need to set `name` -->
  <TemplateFoo.define v-slot="{ msg }">
    <!-- `msg` is typed as `string` -->
    <div>Hello {{ msg.toUpperCase() }}</div>
  </TemplateFoo.define>

  <TemplateFoo.reuse msg="World" />
</template>
```

## References

Existing Vue discussions/issues about reusing template:

- [Discussion on Reusing Templates](https://github.com/vuejs/core/discussions/6898)

Existing Solutions:

- [Vue Macros - `namedTemplate`](https://vue-macros.sxzz.moe/features/named-template.html)
- [`unplugin-vue-reuse-template`](https://github.com/liulinboyi/unplugin-vue-reuse-template)

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2022 [Anthony Fu](https://github.com/antfu)
