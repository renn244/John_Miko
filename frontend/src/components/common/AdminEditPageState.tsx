import type { ReactNode } from "react";

const AdminEditPageState = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-1 items-center justify-center py-8">
    {children}
  </div>
);

export default AdminEditPageState;
