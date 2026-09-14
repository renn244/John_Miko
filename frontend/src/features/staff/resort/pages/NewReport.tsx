import ReportForm from "@/features/staff/resort/forms/ReportForm";
import { useNavigate } from "react-router";
const NewReport = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">New report</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Document the concern clearly for admin review.
        </p>
      </header>
      <ReportForm
        onCreated={(id) =>
          navigate(`/staff/resort/report/${id}`, { replace: true })
        }
      />
    </div>
  );
};
export default NewReport;
