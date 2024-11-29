import { PropertiesList } from "./properties";

export abstract class ValueObject<
  ValueObjectProperties extends PropertiesList
> {
  public properties: ValueObjectProperties;

  protected constructor(properties: ValueObjectProperties) {
    this.properties = properties;
  }

  public get stringProperties(): string {
    return JSON.stringify(this.properties);
  }

  public isEqual(valueObject: ValueObject<ValueObjectProperties>): boolean {
    if (!(valueObject instanceof ValueObject)) {
      return false;
    }

    if (this.stringProperties !== valueObject.stringProperties) {
      return false;
    }

    return true;
  }
}
