import type { ComponentInternalInstance, DefineComponent, Slot } from 'vue'
import { defineComponent, getCurrentInstance, renderSlot } from 'vue'

export type DefineTemplateComponent<T> = DefineComponent<{}> & {
  new(): { $slots: { default(_: T): any } }
}

export type ReuseTemplateComponent<T> = DefineComponent<T>

const _map = new WeakMap<ComponentInternalInstance, Map<string | symbol, Slot | undefined>>()
function getTemplateRegistry() {
  const instance = getCurrentInstance()!.parent!
  if (!_map.has(instance))
    _map.set(instance, new Map())
  return _map.get(instance)!
}

export const DefineTemplate = defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    const reg = getTemplateRegistry()
    return () => {
      reg.set(props.name, slots.default)
      return null
    }
  },
})

export const ReuseTemplate = defineComponent({
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props, { attrs }) {
    const reg = getTemplateRegistry()
    return () => {
      const render = reg.get(props.name)
      if (!render)
        throw new Error(`Reusable template "${props.name}" is not found, having you defined it with <DefineTemplate name="${props.name}">?`)
      return renderSlot({ default: render }, 'default', attrs)
    }
  },
})

/**
 * This function creates `define` and `reuse` components in pair,
 * that you don't need to specify the name for each.
 *
 * It also allow to pass a generic to bind with type.
 */
export function createReusableTemplate<T extends object>() {
  // eslint-disable-next-line symbol-description
  const key = Symbol()

  const define = defineComponent((_, { slots }) => {
    const reg = getTemplateRegistry()
    return () => {
      reg.set(key, slots.default)
      return null
    }
  })
  const reuse = defineComponent((_, { attrs }) => {
    const reg = getTemplateRegistry()
    return () => {
      const render = reg.get(key)
      if (!render)
        throw new Error('Reusable template is not defined')
      return renderSlot({ default: render }, 'default', attrs)
    }
  })

  // TODO: support array and object
  return [define, reuse] as [DefineTemplateComponent<T>, ReuseTemplateComponent<T>]
}
