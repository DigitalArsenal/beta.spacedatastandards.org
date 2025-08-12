import { Switch } from "@headlessui/react";
import { Sun, Moon } from "lucide-react";

function ThemeToggle({ checked, onChange }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border border-white/10 bg-white/5">
      <Sun className="h-4 w-4 opacity-70" />

      <Switch
        checked={checked}
        onChange={onChange}
        aria-label="Toggle dark mode"
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition
          ${checked ? "bg-violet-500/60 border-violet-400/40" : "bg-white/10 border-white/20"}`}
      >
        <span className="sr-only">Toggle theme</span>
        <span
          aria-hidden="true"
          className={`absolute left-1 inline-block h-4 w-4 rounded-full bg-white shadow transition-transform
            ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </Switch>

      <Moon className="h-4 w-4 opacity-70" />
    </div>
  );
}

export default ThemeToggle;

/* Usage in your Topbar:
  <ThemeToggle checked={dark} onChange={setDark} />
*/
