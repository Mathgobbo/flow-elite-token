// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.walletAuthMachine.LOGGING:invocation[0]": {
      type: "done.invoke.walletAuthMachine.LOGGING:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.walletAuthMachine.LOGGING:invocation[0]": {
      type: "error.platform.walletAuthMachine.LOGGING:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    disconnectWallet: "done.invoke.walletAuthMachine.DISCONNECTING:invocation[0]";
    signInService: "done.invoke.walletAuthMachine.LOGGING:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: "disconnectWallet" | "signInService";
  };
  eventsCausingActions: {
    assignError: "error.platform.walletAuthMachine.LOGGING:invocation[0]";
    assignUser: "done.invoke.walletAuthMachine.LOGGING:invocation[0]";
    disconnectContext: "disconnect";
    startLoading: "signInToWallet";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    disconnectWallet: "disconnect";
    signInService: "signInToWallet";
  };
  matchesStates: "DISCONNECTING" | "LOGGED_IN" | "LOGGING" | "NOT_LOGGED_IN";
  tags: never;
}
