export const labelValidator = (
  label: string | null | undefined
): string | null => {
  let val = label;
  if (!val) {
    return null;
  }
  val = val.trim();
  if (val.length === 0) {
    return null;
  }
  return val;
};
