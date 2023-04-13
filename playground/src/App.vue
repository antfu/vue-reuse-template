<script setup lang="ts">
import { ref } from 'vue'
import { createReusableTemplate } from '../../src'

const greeting = ref('Hello')

const [DefineFoo, ReuseFoo] = createReusableTemplate<{ msg: string }>()
const TemplateBar = createReusableTemplate<{ msg: string }>()
const [DefineBiz, ReuseBiz] = createReusableTemplate<{ msg: string }>()
</script>

<template>
  <!-- createReusableTemplate with array -->
  <DefineFoo v-slot="{ msg }">
    <div>Foo: {{ greeting }} {{ msg }}</div>
  </DefineFoo>
  <ReuseFoo msg="world" />

  <!-- createReusableTemplate dot notation -->
  <TemplateBar.define v-slot="{ msg }">
    <div>Bar: {{ msg }}</div>
  </TemplateBar.define>
  <TemplateBar.reuse msg="world" />

  <!-- Slots -->
  <DefineBiz v-slot="{ msg, $slots }">
    <div>Biz: {{ msg }}</div>
    <component :is="$slots.default" />
  </DefineBiz>
  <ReuseBiz msg="reuse 1">
    <div>This is a slot from Reuse</div>
  </ReuseBiz>
  <ReuseBiz msg="reuse 2">
    <div>This is another one</div>
  </ReuseBiz>

  <button @click="greeting = greeting === 'Hi' ? 'Hello' : 'Hi'">
    Toggle Greeting
  </button>
</template>
