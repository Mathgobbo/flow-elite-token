import { assign, createMachine } from "xstate";

export const mintTokensMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCWA7ALgFQPYGsx1YBZAQwGMALDMAOgjMzIFEsAnATwGIWA5bCwBKAfQCCJAPIBVASOySRJAJICA2gAYAuolAAHXLFSZUudLpAAPRABYATABoQnRAEYbrugHYArBo2urgDMNgCcQcE2XgC+0U5oWHiExOTUtAxMrBw8AMrSAEIq2Jo6SCAGRiZmFtYIdgBsABx0jY0+9Rp2Njb13aFOLghB7XQ+QY1eHROuk15dsfEYOAREpJQ06PQJJuhQ3BBm9BgAbit020mrqRtbSxhQCCe4FEym6CUlFhXGbzWIXp06E0vFEgv42l5AgNEHYgqE6HCgnY7BMvL4wT4FiALisUut0rAAK4UChwWDcSywZiYehkABmNPYAAowf4AJTcHHJNZpTZ0IkksmfMrfKrmMq1LwROgzVxteqs9pzaEIRqeMKhTWBIJS0KtOxYrlXfF87b3bhgdjsXDsOh6AA2TDpNuQ5yWlzxvNuWHuj3QpxeYo+2i+hh+1QlMNCPiBXU1PlCNjhGla9RVyKCdCi9XaGjGaMaKdicRA6FwEDgFiNnpuocqv0jCAAtGnnIgW3R-P47BoFRMk4WfJiS9WeTcMsw2JguHXw+LQLVXL26HYl+EvGrXGNhl50-ZvBoIuM4VvGrCbIb3bix+kzbtZ2K-gg-Bo6Ouwu5C8DHG26jqga4oRoqES6rl4QFBJeiTXtcBLEqSsDwCKYaPo2oQojKcZSh4W7xiqgSeGCmoaKEGhopC9R2DExZAA */
  createMachine(
    {
      id: "mintTokensMachine",
      initial: "dataEntry",
      tsTypes: {} as import("./mintTokensMachine.typegen").Typegen0,
      schema: {
        context: {} as {
          amountToMint: number;
          error: Error | null;
          loading: boolean;
          success: null | boolean;
        },
        services: {} as {
          mintTokens: { data: boolean };
        },
        events: {} as { type: "ENTER_AMOUNT_TO_MINT"; value: number } | { type: "SUBMIT" },
      },
      context: {
        amountToMint: 0,
        error: null,
        loading: false,
        success: null,
      },
      states: {
        dataEntry: {
          on: {
            ENTER_AMOUNT_TO_MINT: {
              actions: "cacheAmountToMint",
            },
            SUBMIT: {
              target: "minting",
              actions: "assignClearFeedbacks",
            },
          },
        },

        minting: {
          invoke: {
            src: "mintTokens",
            onDone: {
              target: "success",
              actions: "assignSuccessToContext",
            },
            onError: {
              target: "dataEntry",
              actions: "assignErrorToContext",
            },
          },
        },

        success: {
          after: {
            "3000": {
              target: "dataEntry",
              actions: "assignClearFeedbacks",
            },
          },
        },
      },
    },
    {
      actions: {
        assignClearFeedbacks: assign((context, event, meta) => {
          console.log("assignClearFeedbacks", event);
          return { ...context, error: null, success: null };
        }),
        assignErrorToContext: assign((ctx, event) => {
          console.log("assignErrorToContext", event.data);
          return { ...ctx, error: event.data as Error };
        }),
        assignSuccessToContext: assign((ctx, event) => {
          console.log("assignSuccessToContext", event.data);
          return {
            ...ctx,
            success: event.data,
          };
        }),
        cacheAmountToMint: assign((ctx, event) => ({
          amountToMint: event.value,
        })),
      },
    }
  );
