import { Check } from "lucide-react";

interface SuccessScreenProps {
  title: string;
  message: string;
  ctaText: string;
  ctaHref: string;
}

const SuccessScreenPage = ({
  title = "You've created a new account",
  message = "You can now sign in using your new account",
  ctaText = "Sign in with your new account",
  ctaHref = "/login",
}: SuccessScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-50 p-6">
            <Check className="h-12 w-12 text-themison-success" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-4">{title}</h1>
        <p className="text-themison-gray mb-8">{message}</p>

        <a href={ctaHref} className="themison-button inline-block">
          {ctaText}
        </a>
      </div>
    </div>
  );
};

export { SuccessScreenPage };
