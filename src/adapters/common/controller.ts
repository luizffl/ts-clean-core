import { ApplicationError } from "../../shared/applicationError";
import { UseCase } from "../../useCases/common/useCase";
import { Presenter } from "./presenters";

export abstract class Controller<
  RawInput,
  RawOutput,
  UseCaseInput,
  UseCaseOutput
> {
  protected abstract useCase: UseCase<UseCaseInput, UseCaseOutput>;
  protected abstract presenter: Presenter<RawInput, RawOutput, UseCaseOutput>;

  abstract validateInput(rawInput: RawInput): Promise<void>;

  abstract formatInput(rawInput: RawInput): Promise<UseCaseInput>;

  async execute(rawInput: RawInput): Promise<RawOutput> {
    try {
      await this.validateInput?.(rawInput);
      const useCaseInput = await this.formatInput?.(rawInput);
      const result = await this.useCase.execute(useCaseInput);
      return await this.presenter.present(result, rawInput);
    } catch (error) {
      const applicationError = ApplicationError.buildFromError(error as Error);
      return await this.presenter.handleError(applicationError, rawInput);
    }
  }
}
