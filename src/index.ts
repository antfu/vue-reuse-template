import type { DefineComponent, Slot } from 'vue'
import { defineComponent } from 'vue'

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

/**
 * This function creates `define` and `reuse` components in pair,
 * that you don't need to specify the name for each.
 *
 * It also allow to pass a generic to bind with type.
 */
export function createReusableTemplate<
  Bindings extends object,
  Slots extends Record<string, Slot | undefined> = Record<string, Slot | undefined>,
>(name?: string) {
  let render: Slot | undefined

  const define = defineComponent((_, { slots }) => {
    return () => {
      render = slots.default
    }
  }) as DefineTemplateComponent<Bindings, Slots>

  const reuse = defineComponent({
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => {
        if (!render && process.env.NODE_ENV !== 'production')
          throw new Error(`[vue-reuse-template] Failed to find the definition of template${name ? ` "${name}"` : ''}`)
        return render?.({ ...attrs, $slots: slots })
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
