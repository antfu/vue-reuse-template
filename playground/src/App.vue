<script setup lang="ts">
import { ref } from 'vue'
import { DefineTemplate, ReuseTemplate, createReusableTemplate } from '../../src'

const greeting = ref('Hello')

const [DefineFoo, ReuseFoo] = createReusableTemplate<{ msg: string }>()
</script>

<template>
  <DefineTemplate v-slot="{ data }" name="test">
    <div>Test1: {{ greeting }} {{ data.toString().toUpperCase(0) }}</div>
  </DefineTemplate>

  <DefineTemplate v-slot="{ data }" name="test2">
    <div>Test2: {{ greeting }} {{ data.toString().toUpperCase(0) }}</div>
  </DefineTemplate>

  <ReuseTemplate name="test" data="world" />
  <ReuseTemplate name="test" :data="1 + 1" />
  <ReuseTemplate name="test2" data="Vue!" />

  <DefineFoo v-slot="{ msg }">
    <div>Foo: {{ greeting }} {{ msg }}</div>
  </DefineFoo>
  <ReuseFoo msg="world" />

  <button @click="greeting = greeting === 'Hi' ? 'Hello' : 'Hi'">
    Change greeting
  </button>
</template>
