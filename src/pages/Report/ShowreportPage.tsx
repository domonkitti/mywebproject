import BudgetTable from "../../components/report/Reportprojects";


const AllreportsPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-10">สรุปงบประมาณโครงการ (Admin)</h1>
      <BudgetTable />
    </div>
  );
};

export default AllreportsPage;
