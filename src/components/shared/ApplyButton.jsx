import { ChevronRight } from "lucide-react";

const ApplyButton = ({ children = "Apply Now" }) => {
  return (
    <button className="btn-royal flex items-center gap-2 group">
      {children}
      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
    </button>
  );
};

export default ApplyButton;
