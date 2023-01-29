import { createMachine } from "xstate";

export const mintTokensMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCWA7ALgFQPYGsx1YBZAQwGMALDMAOgjMzIFEsAnATwGIWA5bCwBKAfQCCJAPIBVASOySRJAJICA2gAYAuolAAHXLFSZUudLpAAPRAFoAjAGYATHQBsATlcBWAOwaAHHauACw+Tj4OADQgnIheXnSe-l7uoU4adimpAL7Z0WhYeITE5NS0DEysHDwAytIAQirYmjpIIAZGJmYW1gjhwXROKek+XsEhwQ4OXtGxCA52dnQBwYsa7r4aTv4+ufkYOAREpJQ06PQANrhkEBhQJAfcEGb0GABuR3QFh8UnZed0K43O4PLAId64ChMUzoFotCwdYwwnqIbwDdzbML+ZIbVzY2aIdLuZaZSb+SYYpxOBz+PYgb5FY6lM6Xa63dD3R5gdjsXDsOh6C5MABmfOQXwOjJKp3KQPZnLBEKhXVh2nhbURKpRfVCdH8rlc6Q0wRNrh8wQ0rgJCDsfjoDjCTjs-idqQ0YV2eXpkqO0v+9FgAFcKBQ4LBuJZYMxMPQyMKY+wABQODSpgCU3AZvr+LLoQZDYfV+kMSO6bV6PjsGkSoxShtcdnCVOtXiWjap22xGWmC1yXvQuAgcAsWd+zNoCJLWvLtmd1Y83j8gRCHqiMVsJsSDarjgiGi8DqcdNHTJlAMYzDYmC4k86yJnCC8-jowS8Tq8W0bY3WdmC1udxIpDsy7Oua6yuMePpjmerLAhyoKYLepbmA+r4OHQto7FWVKuAs4z-uSdCtmMwT6k6qY+AakGFNm44AvmoawPAGpTveoC9P4DgDAaCzUuSDieJ41rBC4B7Yu4wFVi6gR9tkQA */
  createMachine({
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
      events: {} as { type: "ENTER_AMOUNT_TO_MINT" } | { type: "SUBMIT" },
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
            target: "loadingMint",
          },
        },
      },
      loadingMint: {
        invoke: {
          src: "mintTokens",
          onError: {
            target: "dataEntry",
            actions: "assignErrorToContext",
          },
          onDone: {
            target: "success",
          },
        },
      },
      success: {
        entry: "assignSuccessToContext",
        after: {
          "3000": "dataEntry",
        },
      },
    },
  });
