import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { Fragment, defineComponent, h, renderSlot } from 'vue'
import { createReusableTemplate } from '../src'

describe('nested', () => {
  it('should work', () => {
    const CompA = defineComponent((_, { slots }) => {
      return () => renderSlot(slots, 'default')
    })

    const [DefineFoo, ReuseFoo] = createReusableTemplate()

    const wrapper = mount({
      render() {
        return h(Fragment, null, [
          h(DefineFoo, () => ['Foo']),
          h(CompA, () => h(ReuseFoo)),
        ])
      },
    })

    expect(wrapper.text()).toBe('Foo')
  })
})
