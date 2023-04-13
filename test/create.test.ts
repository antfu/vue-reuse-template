import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { Fragment, h } from 'vue'
import { createReusableTemplate } from '../src'

describe('creates', () => {
  it('should work', () => {
    const [DefineFoo, ReuseFoo] = createReusableTemplate()
    const [DefineBar, ReuseBar] = createReusableTemplate()
    const Zig = createReusableTemplate()

    const wrapper = mount({
      render() {
        return h(Fragment, null, [
          h(DefineFoo, () => ['Foo']),
          h(ReuseFoo),

          h(DefineBar, () => ['Bar']),
          h(Zig.define, () => ['Zig']),
          h(ReuseFoo),
          h(ReuseBar),
          h(Zig.reuse),
        ])
      },
    })

    expect(wrapper.text()).toBe('FooFooBarZig')
  })
})
