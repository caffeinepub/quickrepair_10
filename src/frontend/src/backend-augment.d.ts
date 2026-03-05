// Type augmentation to extend backendInterface with platform-level methods.
// This bridges the generated types without modifying protected files.

import type { ActorMethod } from "@icp-sdk/core/agent";
import type { CreateActorOptions, ExternalBlob } from "./backend";

declare module "./backend" {
  interface backendInterface {
    _initializeAccessControlWithSecret(secret: string): Promise<void>;
  }

  // Re-declare createActor so its return type satisfies the augmented backendInterface.
  // This tells TypeScript that the actor returned includes the platform method.
  function createActor(
    canisterId: string,
    uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
    downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
    options?: CreateActorOptions,
  ): backendInterface;
}

declare module "./declarations/backend.did" {
  interface _SERVICE {
    _initializeAccessControlWithSecret: ActorMethod<[string], undefined>;
  }
}
