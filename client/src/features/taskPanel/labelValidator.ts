export const labelValidator = (
  label: string | null | undefined
): boolean => {
  if (!label) {
    return false;
  }
  if (label.trim().length === 0) {
    return false;
  }
  return true;
};
