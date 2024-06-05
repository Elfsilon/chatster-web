import { DependencyManager } from './dependency_manager'

class TestClass {
  test(): boolean {
    return true
  }
}

describe('Dependency manager', () => {
  const key = Symbol.for('test-key')

  test('calling registerLazy() must not throw an error', () => {
    const manager = new DependencyManager()
    const fn = jest.fn(() => manager.register(key, () => new TestClass()))

    fn()

    expect(fn).toReturn()
  })

  test('calling provide() when dependency is registered empty must throw an error', () => {
    const manager = new DependencyManager()
    expect(() => manager.provide(key)).toThrowError()
  })

  test('calling provide() when dependency is not registered must not throw', () => {
    const manager = new DependencyManager()
    manager.register(key, () => new TestClass())
    const fn = jest.fn(() => manager.provide(key))

    fn()

    expect(fn).toReturn()
  })

  test('provided dependency must be an instance of TestClass', () => {
    const manager = new DependencyManager()
    manager.register(key, () => new TestClass())
    const obj = manager.provide(key)
    expect(obj).toBeInstanceOf(TestClass)
  })
})
