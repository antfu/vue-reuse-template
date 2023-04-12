<script setup lang="ts">
import { ref } from 'vue'
import { DefineTemplate, ReuseTemplate, createReusableTemplate } from '../../src'

const greeting = ref('Hello')

const [DefineFoo, ReuseFoo] = createReusableTemplate<{ msg: string }>()
const TemplateBar = createReusableTemplate<{ msg: string }>()
const [DefineBiz, ReuseBiz] = createReusableTemplate<{ msg: string }>()
</script>

<template>
  <!-- basic 1 -->
  <DefineTemplate v-slot="{ data }" name="test">
    <div>Test1: {{ greeting }} {{ data.toString().toUpperCase(0) }}</div>
  </DefineTemplate>
  <ReuseTemplate name="test" data="world" />
  <ReuseTemplate name="test" :data="1 + 1" />

  <!-- no name -->
  <DefineTemplate v-slot="{ data }">
    <div>Test2: {{ greeting }} {{ data.toString().toUpperCase(0) }}</div>
  </DefineTemplate>
  <ReuseTemplate data="Vue!" />

  <!-- createReusableTemplate with array -->
  <DefineFoo v-slot="{ msg }">
    <div>Foo: {{ msg }}</div>
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
