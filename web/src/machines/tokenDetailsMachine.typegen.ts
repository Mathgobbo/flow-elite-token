// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.tokenDetailsMachine.LOADING:invocation[0]": {
      type: "done.invoke.tokenDetailsMachine.LOADING:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.tokenDetailsMachine.LOADING:invocation[0]": {
      type: "error.platform.tokenDetailsMachine.LOADING:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    fetchTokenDetails: "done.invoke.tokenDetailsMachine.LOADING:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: "fetchTokenDetails";
  };
  eventsCausingActions: {
    assignError: "error.platform.tokenDetailsMachine.LOADING:invocation[0]";
    assignLoading: "revalidate" | "xstate.init";
    assignTokenDetails: "done.invoke.tokenDetailsMachine.LOADING:invocation[0]";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    fetchTokenDetails: "revalidate" | "xstate.init";
  };
  matchesStates: "ERROR" | "LOADED" | "LOADING";
  tags: never;
}
