import {
  asClass,
  asValue,
  AwilixContainer,
  createContainer,
  InjectionMode,
  Lifetime,
} from "awilix";
import path from "path";

export interface ContainerOptions {
  loggerPrefix?: Record<string | symbol, unknown>;
}

export class ContainerLoader {
  private static awilixContainer: AwilixContainer;
  private static baseDir: string = path.resolve(`${__dirname} + '/../..`);

  static get container(): AwilixContainer {
    if (!this.awilixContainer) {
      this.awilixContainer = this.loadContainer();
    }

    return this.awilixContainer;
  }

  static getScopedContainer(
    containerOptions?: ContainerOptions
  ): AwilixContainer {
    return this.loadScopedContainer(this.container, containerOptions);
  }

  private static loadScopedContainer(
    container: AwilixContainer,
    containerOptions?: ContainerOptions
  ): AwilixContainer {
    const scopedContainer = container.createScope();

    container.register(
      "loggerPrefix",
      asValue(containerOptions?.loggerPrefix ?? {})
    );

    container.loadModules(
      [`${this.baseDir}/infrastructure/plugins/scoped/*.*`],
      {
        formatName: this.formatModuleName,
        resolverOptions: {
          register: asClass,
          lifetime: Lifetime.SCOPED,
        },
      }
    );

    return scopedContainer;
  }

  private static loadContainer(): AwilixContainer {
    const container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
      strict: true,
    });

    container.loadModules(
      [`${this.baseDir}/infrastructure/plugins/singleton/*.*`],
      {
        formatName: this.formatModuleName,
        resolverOptions: {
          register: asClass,
          lifetime: Lifetime.SINGLETON,
        },
      }
    );

    container.loadModules(
      [
        `${this.baseDir}/useCases/**/*.useCase.*`,
        `${this.baseDir}/adapters/**/*.controller.*`,
        `${this.baseDir}/adapters/**/*.presenter.*`,
        `${this.baseDir}/adapters/gateway/*.*`,
      ],
      {
        formatName: this.formatModuleName,
        resolverOptions: {
          register: asClass,
          lifetime: Lifetime.SCOPED,
        },
      }
    );

    return container;
  }

  private static convertToCamelCase(text: string): string {
    return text.replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );
  }

  private static formatModuleName(name: string): string {
    console.log(`Importing module ${name}`);
    return ContainerLoader.convertToCamelCase(name.replace(".", "-")).replace(
      "-",
      ""
    );
  }
}
