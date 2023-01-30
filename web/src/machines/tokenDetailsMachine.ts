import { assign, createMachine } from "xstate";

export const tokenDetailsMachine = createMachine(
  {
    tsTypes: {} as import("./tokenDetailsMachine.typegen").Typegen0,
    id: "tokenDetailsMachine",
    context: {
      tokenDetails: {},
      loading: true,
      error: null,
    },
    schema: {
      context: {} as { loading: boolean; error: Error | null; tokenDetails: any },
      events: {} as { type: "revalidate" },
      services: {
        fetchTokenDetails: {} as {
          data: any;
        },
      },
    },
    initial: "LOADING",
    states: {
      LOADING: {
        entry: "assignLoading",
        invoke: {
          src: "fetchTokenDetails",
          onDone: {
            target: "LOADED",
            actions: "assignTokenDetails",
          },
          onError: {
            target: "ERROR",
            actions: "assignError",
          },
        },
      },
      LOADED: {
        on: {
          revalidate: {
            target: "LOADING",
          },
        },
      },
      ERROR: {
        on: {
          revalidate: {
            target: "LOADING",
          },
        },
      },
    },
  },
  {
    actions: {
      assignError: assign((ctx, event) => {
        return { ...ctx, loading: false, error: event.data as Error | null };
      }),
      assignLoading: assign((ctx, event) => {
        return { ...ctx, loading: true };
      }),
      assignTokenDetails: assign((ctx, event) => {
        return { ...ctx, error: null, loading: false, tokenDetails: event.data };
      }),
    },
  }
);
