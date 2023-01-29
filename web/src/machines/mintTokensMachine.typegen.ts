// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.mintTokensMachine.loadingMint:invocation[0]": {
      type: "done.invoke.mintTokensMachine.loadingMint:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.mintTokensMachine.loadingMint:invocation[0]": {
      type: "error.platform.mintTokensMachine.loadingMint:invocation[0]";
      data: unknown;
    };
    "xstate.after(3000)#mintTokensMachine.success": { type: "xstate.after(3000)#mintTokensMachine.success" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    mintTokens: "done.invoke.mintTokensMachine.loadingMint:invocation[0]";
  };
  missingImplementations: {
    actions: "assignErrorToContext" | "assignSuccessToContext" | "cacheAmountToMint";
    delays: never;
    guards: never;
    services: "mintTokens";
  };
  eventsCausingActions: {
    assignErrorToContext: "error.platform.mintTokensMachine.loadingMint:invocation[0]";
    assignSuccessToContext: "done.invoke.mintTokensMachine.loadingMint:invocation[0]";
    cacheAmountToMint: "ENTER_AMOUNT_TO_MINT";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    mintTokens: "SUBMIT";
  };
  matchesStates: "dataEntry" | "loadingMint" | "success";
  tags: never;
}
