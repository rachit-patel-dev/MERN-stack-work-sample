type ObjectValues<T> = T[keyof T];

interface Field {
  name: string;
  type?: string | { [key: string]: any };
  regex?: RegExp;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

interface SerializedData {
  [key: string]: any;
}

interface Serializer {
  serializeData(data: { [key: string]: any }, fields: Field[]): Promise<SerializedData>;
  serialize(data: any, fields: Field[]): Promise<SerializedData | SerializedData[]>;
}

class SerializerClass implements Serializer {
  async serializeData(data: { [key: string]: any }, fields: Field[]): Promise<SerializedData> {
    const serializedData: SerializedData = {};
    for (const field of fields) {
      if (!data.hasOwnProperty(field.name)) {
        if (field.required) {
          throw new Error(`Missing required field: ${field.name}`);
        }
        continue;
      }
      await this.validate(field, data[field.name]);
      serializedData[field.name] = data[field.name];
    }
    return serializedData;
  }

  async serialize(data: any, fields: Field[]): Promise<SerializedData | SerializedData[]> {
    if (Array.isArray(data)) {
      let serializedDataArray: SerializedData[] = [];
      for (const item of data) {
        serializedDataArray.push(await this.serializeData(item, fields));
      }
      return serializedDataArray;
    } else {
      return this.serializeData(data, fields);
    }
  }

  async validate(field: Field, value: any): Promise<void> {
    if (value === null) {
      throw new Error(`Value for ${field.name} should not be null`);
    }
    if (
      field.type &&
      (typeof field.type == "object"
        ? !this.objectValidate(field.type, value)
        : typeof value !== field.type)
    ) {
      throw new Error(
        `${field.name} should be of type: ${typeof field.type == "object" ? ObjectValues(field.type) : field.type
        }`
      );
    }
    if (field.regex && typeof value === "string" && !value.match(field.regex)) {
      throw new Error(`${field.name} value does not match the regex pattern: ${field.regex}`);
    }
    if (
      field.hasOwnProperty("minLength") &&
      (typeof value === "string" ? value.length : value) < field.minLength
    ) {
      throw new Error(
        `Minimum length of ${field.name} should be greater than ${field.minLength}`
      );
    }
    if (
      field.hasOwnProperty("maxLength") &&
      (typeof value === "string" ? value.length : value) > field.maxLength
    ) {
      throw new Error(
        `Maximum length of ${field.name} should be less than ${field.maxLength}`
      );
    }
  }

  objectValidate(type: { [key: string]: any }, value: any): boolean {
    return type.length
      ? true
      : Object.values(type).includes(value)
        ? true
        : false;
  }
}

export default SerializerClass;