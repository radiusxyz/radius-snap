export async function instantiate(module, imports = {}) {
  const __module0 = imports["../src/bindings.ts"];
  const adaptedImports = {
    "../src/bindings.ts": __module0,
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  return exports;
}
