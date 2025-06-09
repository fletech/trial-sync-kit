import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-themison-text group-[.toaster]:border-2 group-[.toaster]:border-black group-[.toaster]:shadow-xl group-[.toaster]:ring-1 group-[.toaster]:ring-black/20",
          description: "group-[.toast]:text-themison-gray",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-white group-[.toast]:border group-[.toast]:border-black",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-themison-text group-[.toast]:border group-[.toast]:border-black",
          success:
            "group-[.toaster]:border-themison-success group-[.toaster]:bg-green-50",
          error: "group-[.toaster]:border-red-500 group-[.toaster]:bg-red-50",
          warning:
            "group-[.toaster]:border-yellow-500 group-[.toaster]:bg-yellow-50",
          info: "group-[.toaster]:border-blue-500 group-[.toaster]:bg-blue-50",
        },
        style: {
          fontSize: "14px",
          fontWeight: "500",
        },
      }}
      position="top-right"
      expand={false}
      visibleToasts={3}
      {...props}
    />
  );
};

export { Toaster, toast };
