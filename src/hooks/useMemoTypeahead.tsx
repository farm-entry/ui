import { useMemo } from "react";
import { UseFormWatch } from "react-hook-form";
import { TypeAheadOption } from "../components/inputs";

// Memoize the selected group value
const useTypeAheadValue = <T extends { [key: string]: any }>(
  watch: UseFormWatch<any>,
  fieldName: any,
  options: T[],
  labelKey: keyof T,
  valueKey: keyof T,
  defaultValue?: TypeAheadOption | null
): TypeAheadOption | null => {
  return useMemo(() => {
    const fieldValue = watch(fieldName);

    if (!fieldValue) {
      return defaultValue || null;
    }

    const option = options.find((item) => item[valueKey] === fieldValue);
    return option
      ? ({
          label: String(option[labelKey]),
          value: option[valueKey],
        } as TypeAheadOption)
      : null;
  }, [watch(fieldName), options, defaultValue]);
};

export default useTypeAheadValue;
