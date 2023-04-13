import type { ComponentInternalInstance, DefineComponent, Slot } from 'vue'
import { defineComponent, getCurrentInstance, renderSlot } from 'vue'

export type DefineTemplateComponent<
 Bindings extends object,
 Slots extends Record<string, Slot | undefined>,
 Props = {},
> = DefineComponent<Props> & {
  new(): { $slots: { default(_: Bindings & { $slots: Slots }): any } }
}

export type ReuseTemplateComponent<
  Bindings extends object,
  Slots extends Record<string, Slot | undefined>,
> = DefineComponent<Bindings> & {
  new(): { $slots: Slots }
}

const _map = /* @__PURE__ */ new WeakMap<ComponentInternalInstance, Map<string | symbol, Slot | undefined>>()
function getTemplateRegistry() {
  // store the render registry with a WeakMap
  // bound to the parent component instance (the one that uses the template)
  const instance = getCurrentInstance()!.parent!
  if (!_map.has(instance))
    _map.set(instance, new Map())
  return _map.get(instance)!
}

/**
 * Define a reusable template, renders nothing
 */
export const DefineTemplate = /* @__PURE__ */ defineComponent({
  props: {
    name: {
      type: String,
      default: 'default',
    },
  },
  setup(props, { slots }) {
    const reg = getTemplateRegistry()
    return () => {
      // register the render function
      reg.set(props.name, slots.default)
    }
  },
}) as DefineTemplateComponent<any, Record<string, Slot | undefined>, { name?: string }>

/**
 * Reuse a template defined by `DefineTemplate`
 */
export const ReuseTemplate = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: 'default',
    },
  },
  setup(props, { attrs, slots }) {
    const reg = getTemplateRegistry()
    return () => {
      // get the render function from DefineTemplate
      const render = reg.get(props.name)
      if (!render && process.env.NODE_ENV !== 'production')
        throw new Error(`[vue-reuse-template] Reusable template "${props.name}" is not defined, have you used <DefineTemplate name="${props.name}">?`)
      return renderSlot({ default: render }, 'default', { ...attrs, $slots: slots })
    }
  },
}) as ReuseTemplateComponent<{ name?: string }, Record<string, Slot | undefined>>

export {
  /**
   * Alias for `DefineTemplate`
   */
  DefineTemplate as TemplateDefine,
  /**
   * Alias for `ReuseTemplate`
   */
  ReuseTemplate as TemplateReuse,
}

/**
 * This function creates `define` and `reuse` components in pair,
 * that you don't need to specify the name for each.
 *
 * It also allow to pass a generic to bind with type.
 */
export function createReusableTemplate<
  Bindings extends object,
  Slots extends Record<string, Slot | undefined> = Record<string, Slot | undefined>,
>() {
  // eslint-disable-next-line symbol-description
  const key = Symbol()

  const define = defineComponent((_, { slots }) => {
    const reg = getTemplateRegistry()
    return () => {
      reg.set(key, slots.default)
    }
  }) as DefineTemplateComponent<Bindings, Slots>

  const reuse = defineComponent({
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      const reg = getTemplateRegistry()
      return () => {
        const render = reg.get(key)
        if (!render && process.env.NODE_ENV !== 'production')
          throw new Error('[vue-reuse-template] Reusable template is not defined')
        return renderSlot({ default: render }, 'default', { ...attrs, $slots: slots })
      }
    },
  }) as ReuseTemplateComponent<Bindings, Slots>

  return makeDestructurable(
    { define, reuse },
    [define, reuse] as const,
  )
}

/**
 * @see What the hack? https://antfu.me/posts/destructuring-with-object-or-array
 */
function makeDestructurable<
  T extends Record<string, unknown>,
  A extends readonly any[],
>(obj: T, arr: A): T & A {
  const clone = { ...obj }
  Object.defineProperty(clone, Symbol.iterator, {
    enumerable: false,
    value() {
      let index = 0
      return {
        next: () => ({
          value: arr[index++],
          done: index > arr.length,
        }),
      }
    },
  })
  return clone as T & A
}
