import AssignedMaintenanceList from "@/components/pageComponents/Staff/Maintenance/AssignedMaintenanceList";

const AssignedTickets = () => {
  return (
    <AssignedMaintenanceList
      scope="active"
      title="Maintenance"
      description="View and manage maintenance work currently assigned to you."
      emptyTitle="No assigned maintenance"
      emptyDescription="New maintenance work assigned to you will appear here."
    />
  );
};

export default AssignedTickets;
