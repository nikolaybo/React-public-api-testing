import { useCallback } from "react";
import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export default function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const isDark = computed === "dark";

  const handleToggle = useCallback(
    () => setColorScheme(isDark ? "light" : "dark"),
    [setColorScheme, isDark],
  );

  return (
    <ActionIcon
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
      onClick={handleToggle}
    >
      {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
    </ActionIcon>
  );
}
