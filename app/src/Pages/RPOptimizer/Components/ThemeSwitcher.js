import React from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { Switch } from "antd";

const ThemeSwitcher = () => {
  const { switcher, themes, currentTheme } = useThemeSwitcher();
  const [isDarkMode, setIsDarkMode] = React.useState(currentTheme === "dark");

  const toggleTheme = (isChecked) => {
    setIsDarkMode(isChecked);
    switcher({ theme: isChecked ? themes.dark : themes.light });
  };

  return <Switch checked={isDarkMode} onChange={toggleTheme} />;
};

export default ThemeSwitcher;
