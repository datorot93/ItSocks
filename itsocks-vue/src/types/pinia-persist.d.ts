// Augment Pinia's DefineSetupStoreOptions to support persist from pinia-plugin-persistedstate
// This is needed because Pinia v3 uses a more refined Pick<> type for setup stores
// that doesn't inherit the augmented DefineStoreOptionsBase in some TS configurations.
import 'pinia'

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export interface DefineSetupStoreOptions<Id extends string, SS, S, G, A> {
    persist?: boolean | Record<string, unknown> | Array<Record<string, unknown>>
  }
}
