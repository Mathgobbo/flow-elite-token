import { createMachine } from "xstate";
import { assign } from "xstate";

export const walletAuthMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QHcCGAbdYAuBBArtgBYCyqAxkQJYB2YAdADIDyA4qwJIByrAxBAHs69WgDcBAawZpMOAsTKVaDFu26sEYgeVTYqQgNoAGALrGTiUAAcBsKnqGWQAD0QBWAMwAOem4CcHgDsHgBsHgAsIW4AjG7hADQgAJ6IAEyBgfR+gVEhRuFG0eFuAL4liTJYeISkFNTCqpw8vGAATq0CrfRW6LoAZp0AtvSVcjWK9SpsTRpaOg405uZONnYLTq4IHt70ebFxXiEhfl7h0YkpCNGBPqluRg9e0V5GGX7FZRUYVfK1SsJcZgAFQA+o0AKIAERB3F4digNA4NCBAgA6t8cMskCBVvZ9DQNoh9vQnncHqFXgFQhc0qd6NFotk-Klonk7vcPJ8QKNqgo6somNMoTCuPwqLByEI6ORsFjrLY8Y5sZtDj5guFQoE4tEIn5zsk0jl6OEcm43KkjCELZ5Ulyeb8JgLIRwAMoAYWYXC44LdQPU-CEDC0UhGGN5f0m9Gd7s93t96k0NHE83xS1MKwV62ViFV9HVmu1uv1lzcPj85fLpItRm2pXK3LDDv5wmjHq9Pr9zTaHS6PX6Q1DsnDjpbrrbcc7syT2l0qdMcpxmfxhKuZ2iu1S4XLMTX0SMbhpCFSVrzhy39wK6QvZXrNAEEDgTnt42bYAza2X2YQAFpgr5D9+qQ+PcDybn4cRAfklp2o2L7-FMag8O+ioEl+HibsaLKHDkgTREB1IGkeRoWh4Oo3CEXgsqkdwwUOTbwfQgKghC0LcMhWagJsgFuP+hHpCEvihMUWqvKypy0T8cGRixIrsZ+nGIMERh5lufhHIUIR4YECR8eWeY1nheFeP4lrhBJYx8gxraxh26hyUqClXEYXgeMaQTnkUDJ7gefEnuR55QVe+Q3iUQA */
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
