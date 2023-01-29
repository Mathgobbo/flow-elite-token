import { createMachine } from "xstate";
import { assign } from "xstate";

export const walletAuthMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QHcCGAbdYAuBBArtgBYCyqAxkQJYB2YAdADIDyA4qwJIByrAxBAHs69WgDcBAawZpMOAsTKVaDFu26sEYgeVTYqQgNoAGALrGTiUAAcBsKnqGWQAD0QA2I2-pGAnAGYAdj83PwAWNwBWAEYI0IAaEABPRD8jI3pQgMiPUKMo0IiAX0KEmSw8QlIKamFVTh5eMAAnJoEm+it0XQAzNoBbejK5SsUalTZ6jS0dBxpzcycbO1mnVwRcryi8iNiADjc3H13QqITkhAAmNPoAiLSjXajdowCAnwLi0oxy+SqlYS4zAAKgB9OoAUQAIiDuLw7FAaBwaECBAB1b44BZIEBLez6GirRAXC5+eh+KIXO5GYIvfzBM4pTz0NxRHxvC5RDyUu5+T4gIYVBTVZRMCZQmFcfhUWDkIR0cjYLHWWx4xzYtb+Lwk0LBW4nMI+U5JIlHehsyIRK5uK4RPwXPkC36jEWQjgAZQAwswuFxwR6gep+EIGFopIMMYK-mN6K7Pd7ff71JoaOIZvj5qZFiqVurEJr6NrdbEogajedHhkfFWjhSrtS-EU+TQBBA4E5HSNhXQs8t8YSEABaNwMwcRM3Vo4BC4HIwFR4OiNOrvjNQ8Huqgm5hB+Q1mjn7LIBCm7enGy6mgLUksBfa7DnExtfWSR50A4FgsXQ7jrnOgNahC4RwuKtvGCApbheTljgXZ8l3+FdWHFb9sVxX8XEQN5dgLUIqxnTkKQCeIzztC4Cyve9dgiHxPFCGCfk7eCY3dL0fT9AM1xQ7M+y3KIYnSfxCJ8aITl4owIiAyiC32HC7lyC4INo4pCiAA */
  createMachine(
    {
      id: "walletAuthMachine",
      initial: "NOT_LOGGED_IN",
      tsTypes: {} as import("./walletAuthMachine.typegen").Typegen0,
      schema: {
        context: {} as {
          user: any;
          loading: boolean;
          error: null | Error;
        },
        events: {} as { type: "signInToWallet" } | { type: "disconnect" },
        services: {} as {
          disconnectWallet: {
            data: void;
          };
          signInService: { data: any };
        },
      },
      context: {
        user: null,
        error: null,
        loading: false,
      },
      states: {
        LOGGING: {
          entry: "startLoading",
          invoke: {
            src: "signInService",
            onError: {
              actions: "assignError",
              target: "NOT_LOGGED_IN",
            },
            onDone: {
              actions: "assignUser",
              target: "LOGGED_IN",
            },
          },
        },
        NOT_LOGGED_IN: {
          on: {
            signInToWallet: {
              target: "LOGGING",
            },
          },
        },
        LOGGED_IN: {
          on: {
            disconnect: {
              target: "DISCONNECTING",
              actions: "disconnectContext",
            },
          },
        },
        DISCONNECTING: {
          invoke: {
            src: "disconnectWallet",
            onDone: {
              target: "NOT_LOGGED_IN",
            },
            onError: {
              target: "NOT_LOGGED_IN",
            },
          },
        },
      },
    },
    {
      actions: {
        assignError: assign((context, event, meta) => {
          console.log("ASSIGNERROR", event.data);
          return {
            ...context,
            error: event.data as Error | null,
            loading: false,
          };
        }),
        assignUser: assign((context, event, meta) => {
          console.log("ASSIGNUSER", event.data);
          return {
            ...context,
            user: event.data,
            loading: false,
          };
        }),
        disconnectContext: assign((context, event, meta) => {
          console.log("DISCONNECTCONTEXT", event);
          return {
            ...context,
            error: null,
            user: null,
            loading: false,
          };
        }),
        startLoading: assign((context, event, meta) => {
          console.log("STARTLOADING", event);
          return { ...context, loading: true };
        }),
      },
    }
  );
