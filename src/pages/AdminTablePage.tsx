import BudgetTable from "../components/AdminEdit/Table";


const AdminTablePage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-10">สรุปงบประมาณโครงการ (Admin)</h1>
      <BudgetTable />
    </div>
  );
};

export default AdminTablePage;
