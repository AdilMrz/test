import React from "react";
import { Menu, useResourceDefinitions } from "react-admin";

export const TailwindCustomMenu = () => {
  const resources = useResourceDefinitions();

  return (
    <Menu>
      {/* Default React Admin Resources */}
      {Object.keys(resources).map((name) => (
        <Menu.ResourceItem key={name} name={name} />
      ))}
    </Menu>
  );
};
