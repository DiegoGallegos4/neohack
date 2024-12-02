import { createContext, useContext, useState } from "react";

import { Property } from "./utils";

type PropertyContextType = {
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
};

export const PropertyContext = createContext<PropertyContextType>({
  selectedProperty: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSelectedProperty: () => {},
});

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error("useProperty must be used within a PropertyProvider");
  }
  return context;
};

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  return (
    <PropertyContext.Provider value={{ selectedProperty, setSelectedProperty }}>
      {children}
    </PropertyContext.Provider>
  );
}
