**🚛 This package is now part of VueUse v10**.

👉 Refer to https://vueuse.org/createReusableTemplate instead.

----

<details>
  <summary>Legacy README</summary>

# vue-reuse-template

[![NPM version](https://img.shields.io/npm/v/vue-reuse-template?color=a1b858&label=)](https://www.npmjs.com/package/vue-reuse-template)

Define and reuse Vue template inside the component scope.

## Install

```bash
npm i vue-reuse-template
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

We'd like to reuse our code as much as possible. So normally we might need to extract those duplicated parts into a component. However, in a separated component you lose the ability to access the local bindings. Defining props and emits for them can be tedious sometime.

So this library is made to provide a way for defining and reusing templates inside the component scope.

## Usage

In the previous example, we could refactor it to:

```html
<script setup>
import { createReusableTemplate } from 'vue-reuse-template'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
</script>

<template>
  <DefineTemplate>
    <!-- something complex -->
  </DefineTemplate>

  <dialog v-if="showInDialog">
    <ReuseTemplate />
  </dialog>
  <div v-else>
    <ReuseTemplate />
  </div>
</template>
```

- `<DefineTemplate>` will register the template and renders nothing.
- `<ReuseTemplate>` will render the template provided by `<DefineTemplate>`.
- `<DefineTemplate>` must be used before `<ReuseTemplate>`.

> **Note**: It's recommanded to extract as separate components whenever possible. Abusing this library might lead to bad practices for your codebase.

### Passing Data

You can also pass data to the template using slots:

- Use `v-slot="..."` to access the data on `<DefineTemplate>`
- Directly bind the data on `<ReuseTemplate>` to pass them to the template

```html
<script setup>
import { createReusableTemplate} from 'vue-reuse-template'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
</script>

<template>
  <DefineTemplate v-slot="{ data, msg, anything }">
    <div>{{ data }} passed from usage</div>
  </DefineTemplate>

  <ReuseTemplate :data="data" msg="The first usage" />
  <ReuseTemplate :data="anotherData" msg="The second usage" />
  <ReuseTemplate v-bind="{ data: something, msg: 'The third' }" />
</template>
```

### TypeScript Support

`createReusableTemplate` accepts a generic type to provide type support for the data passed to the template:

```html
<script setup lang="ts">
import { createReusableTemplate } from 'vue-reuse-template'

// Comes with pair of `DefineTemplate` and `ReuseTemplate`
const [DefineFoo, ReuseFoo] = createReusableTemplate<{ msg: string }>()

// You can create multiple reusable templates
const [DefineBar, ReuseBar] = createReusableTemplate<{ items: string[] }>()
</script>

<template>
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
<script setup lang="ts">
import { createReusableTemplate } from 'vue-reuse-template'

const TemplateFoo = createReusableTemplate<{ msg: string }>()
</script>

<template>
  <TemplateFoo.define v-slot="{ msg }">
    <!-- `msg` is typed as `string` -->
    <div>Hello {{ msg.toUpperCase() }}</div>
  </TemplateFoo.define>

  <TemplateFoo.reuse msg="World" />
</template>
```

### Passing Slots

It's also possible to pass slots back from `<ReuseTemplate>`. You can access the slots on `<DefineTemplate>` from `$slots`:

```html
<script setup>
import { createReusableTemplate } from 'vue-reuse-template'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
</script>

<template>
  <DefineTemplate v-slot="{ $slots, otherProp }">
    <div some-layout>
      <!-- To render the slot -->
      <component :is="$slots.default" />
    </div>
  </DefineTemplate>

  <ReuseTemplate>
    <div>Some content</div>
  </ReuseTemplate>
  <ReuseTemplate>
    <div>Another content</div>
  </ReuseTemplate>
</template>
```

## Performance

This library has very little overhead. You don't normally need to worry about its performance impact.

## References

Existing Vue discussions/issues about reusing template:

- [Discussion on Reusing Templates](https://github.com/vuejs/core/discussions/6898)

Existing Solutions:

- [Vue Macros - `namedTemplate`](https://vue-macros.sxzz.moe/features/named-template.html)
- [`unplugin-vue-reuse-template`](https://github.com/liulinboyi/unplugin-vue-reuse-template)

</details>

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2022 [Anthony Fu](https://github.com/antfu)
