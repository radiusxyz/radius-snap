declare namespace __AdaptedExports {
  /** Exported memory */
  export const memory: WebAssembly.Memory;
  /**
   * assembly/program/fibonacci
   * @param iterations `i32`
   * @returns `i32`
   */
  export function fibonacci(iterations: number): number;
}
/** Instantiates the compiled WebAssembly module with the given imports. */
export declare function instantiate(module: WebAssembly.Module, imports: {
  "../src/bindings.ts": unknown,
}): Promise<typeof __AdaptedExports>;
