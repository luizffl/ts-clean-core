import { PropertiesList } from "./properties";

export abstract class Entity<T extends PropertiesList> {
  protected hidden?: [keyof T];
  protected rawProperties: T;
  constructor(rawProperties: T) {
    this.rawProperties = this.beforeCreate?.(rawProperties) ?? rawProperties;
  }

  public abstract get entityId(): unknown;

  protected beforeCreate?(rawProperties: T): T;

  protected beforeUpdate?(rawProperties: T): T;

  public set properties(rawProperties: T) {
    this.rawProperties = this.beforeUpdate?.(rawProperties) ?? rawProperties;
  }

  public get properties(): Partial<T> {
    const hiddenSet = new Set(this.hidden ?? []);

    return Object.fromEntries(
      Object.entries(this.rawProperties).filter(([key]) => !hiddenSet.has(key))
    ) as Partial<T>;
  }

  public get entityType(): string | symbol {
    return this.constructor.name;
  }

  public isEqual(entity: Entity<Object>): boolean {
    if (!(entity instanceof Entity)) {
      return false;
    }

    if (this.entityType !== entity.entityType) {
      return false;
    }

    if (this.entityId !== entity.entityId) {
      return false;
    }

    return true;
  }
}
