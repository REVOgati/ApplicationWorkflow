import { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem('app_role') || 'applicant';
    } catch (e) {
      return 'applicant';
    }
  });

  const setRolePersist = (r) => {
    setRole(r);
    try {
      localStorage.setItem('app_role', r);
    } catch (e) {
      // ignore
    }
  };

  return <RoleContext.Provider value={{ role, setRole: setRolePersist }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}

export default RoleContext;
