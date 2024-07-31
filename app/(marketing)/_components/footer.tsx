import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <div className="fixed bottom-0 w-full p-4 border-t bg-slate-100">
      <div className="flex items-center justify-between md:max-w-screen-2xl mx-auto w-full">
        <Logo />
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button size="sm" variant="ghost">
            Privacy Policy
          </Button>
          <Button size="sm" variant="ghost">
            Terms of Service
          </Button>
        </div>
      </div>
    </div>
  );
}
