import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { Fragment, h } from 'vue'
import { DefineTemplate, ReuseTemplate } from '../src'

describe('components', () => {
  it('should work', () => {
    const wrapper = mount({
      render() {
        return h(Fragment, null, [
          h(DefineTemplate, () => ['hello']),

          h(ReuseTemplate),
          h(ReuseTemplate),
        ])
      },
    })

    expect(wrapper.text()).toBe('hellohello')
  })

  it('named', () => {
    const wrapper = mount({
      render() {
        return h(Fragment, null, [
          h(DefineTemplate, { name: 'foo' }, () => ['Foo']),
          h(DefineTemplate, { name: 'bar' }, () => ['Bar']),

          h(ReuseTemplate, { name: 'foo' }),
          h(ReuseTemplate, { name: 'bar' }),
          h(ReuseTemplate, { name: 'bar' }),
          h(ReuseTemplate, { name: 'foo' }),
        ])
      },
    })

    expect(wrapper.text()).toBe('FooBarBarFoo')
  })

  it('throw when not defined', () => {
    expect(() => mount({
      render() {
        return h(Fragment, null, [
          h(ReuseTemplate, { name: 'foo' }),
        ])
      },
    }))
      .toThrowErrorMatchingInlineSnapshot(
        '"[vue-reuse-template] Reusable template \\"foo\\" is not defined, have you used <DefineTemplate name=\\"foo\\">?"',
      )
  })
})
