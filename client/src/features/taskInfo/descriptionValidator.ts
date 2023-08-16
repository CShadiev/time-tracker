type ValidationResult =
  | {
      value: string;
      isValid: true;
    }
  | {
      value: string | null | undefined;
      isValid: false;
      validationError: string;
    };

export const descriptionValidator = (
  value: string | null | undefined
): ValidationResult => {
  if (value === null || value === undefined) {
    return {
      value: "",
      isValid: true,
    };
  }

  let val = value.trim();

  // description strings cannot be longer than 512 characters
  val = val.trim();
  if (val.length > 512) {
    return {
      value: val,
      isValid: false,
      validationError: "Description is too long (max 512 characters)",
    };
  }

  return {
    value: val,
    isValid: true,
  };
};
