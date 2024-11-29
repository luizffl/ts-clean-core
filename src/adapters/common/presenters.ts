import { ApplicationError } from "../../shared/applicationError";

export abstract class Presenter<RawInput, RawOutput, UseCaseOutput> {
  abstract present(
    useCaseOutput: UseCaseOutput,
    rawInput: RawInput
  ): Promise<RawOutput>;

  abstract handleError(
    error: ApplicationError,
    rawInput: RawInput
  ): Promise<RawOutput>;
}
