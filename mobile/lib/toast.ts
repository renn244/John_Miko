import Toast from "react-native-toast-message";

type ToastOptions = {
  description?: string;
};

const showToast = (type: "success" | "error", message: string, options?: ToastOptions) => {
  Toast.show({
    type,
    text1: message,
    text2: options?.description,
    position: "top",
    visibilityTime: 4000,
  });
};

export const toast = {
  error: (message: string, options?: ToastOptions) => showToast("error", message, options),
  success: (message: string, options?: ToastOptions) => showToast("success", message, options),
};
