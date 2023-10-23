import React, { useState, useContext, useMemo } from "react";
import { PublicGroupType } from "../../../../constants";

const usePublicGroups = () => {
  const [groups, setGroups] = useState<Array<PublicGroupType> | [] | undefined>(
    undefined
  );
  const [currentCategory, setCurrentCategory] = useState<string>("Undefined");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return useMemo(
    () => ({
      groups,
      setGroups,
      currentCategory,
      setCurrentCategory,
      searchQuery,
      setSearchQuery,
    }),
    [
      groups,
      setGroups,
      currentCategory,
      setCurrentCategory,
      searchQuery,
      setSearchQuery,
    ]
  );
};

type ContextType = ReturnType<typeof usePublicGroups> | null;

export const PublicGroupsContext = React.createContext<ContextType>(null);

export function usePublicGroupsContext() {
  const context = useContext(PublicGroupsContext);

  if (!context) {
    throw new Error(
      "PublicGroups components must be wrappen in <PublicGroupsContextProvider />"
    );
  }

  return context;
}

export const PublicGroupsContextProvider = ({ children }: any) => {
  const data = usePublicGroups();

  return (
    <PublicGroupsContext.Provider value={data}>
      {children}
    </PublicGroupsContext.Provider>
  );
};
