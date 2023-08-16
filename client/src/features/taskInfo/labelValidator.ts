/**
 * Validates labels for projects/tasks/subtasks.
 * Can also mutate the value (trimming, etc.)
 * If the value is invalid, returns null,
 * otherwise returns the (mutated) value.
 */
export const labelValidator = (
  label: string | null | undefined
): string | null => {
  let val = label;

  // label strings cannot be empty
  if (!val) {
    return null;
  }
  // making sure that trimmed label is not empty
  val = val.trim();
  if (val.length === 0) {
    return null;
  }

  // label strings cannot be longer than 32 characters
  if (val.length > 32) {
    return null;
  }
  return val;
};
