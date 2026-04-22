import { ErrorType } from "@/src/types/common/common";
import { FieldError } from "react-hook-form";

const ErrorMessage = ({ error }: { error?: ErrorType | FieldError }) => {
  if (!error) return null;

  const getErrorMessage = (
    err: Exclude<ErrorType | FieldError, null | undefined>
  ): string => {
    if ("errors" in err && Array.isArray(err.errors) && err.errors.length > 0) {
      return String(err.errors[0]);
    }

    if (
      "errorMessages" in err &&
      Array.isArray(err.errorMessages) &&
      err.errorMessages.length > 0
    ) {
      return err.errorMessages[0]?.message || "Something went wrong!";
    }

    if (typeof err.message === "string" && err.message.trim()) {
      return err.message;
    }

    return "Something went wrong!";
  };

  return (
    <div className="text-rose-600 bg-rose-200 text-center py-2 rounded-sm text-sm capitalize">
      {getErrorMessage(error)}
    </div>
  );
};
export default ErrorMessage;
