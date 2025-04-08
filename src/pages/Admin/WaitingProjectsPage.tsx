import { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import { getReviewedProjects } from "../../apis/UserProjectApi";
import { ProjectForFrontEnd } from "../../interfaces/MainInterface";

const WaitingProjectPage = () => {
  const [projects, setProjects] = useState<ProjectForFrontEnd[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getReviewedProjects();
        const filteredData = data.filter(
          (proj: ProjectForFrontEnd) => proj.status === "รอดำเนินการ"
        );
        setProjects(filteredData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatNumber = (num?: number) =>
    num && num !== 0 ? num.toLocaleString() : "-";

  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold text-center mb-10">
        รายงานสรุปงบประมาณที่ขอตั้งปี 2569
      </h1>

      {isLoading ? (
        <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
      ) : projects.length === 0 ? (
        <p className="text-center text-gray-500">ไม่มีโครงการที่รอดำเนินการ</p>
      ) : (
        <Table striped>
          <Table.Head className="bg-gray-100 text-gray-700">
            <Table.HeadCell rowSpan={3} className="text-center">
              งาน/แผนงาน
            </Table.HeadCell>
            <Table.HeadCell colSpan={4} className="text-center">
              วงเงินขอตั้ง
            </Table.HeadCell>
            <Table.HeadCell colSpan={4} className="text-center">
              เป้าหมายเบิกจ่าย
            </Table.HeadCell>
            <Table.HeadCell rowSpan={2} className="text-center">
              หน่วยงาน
            </Table.HeadCell>
          </Table.Head>
          <Table.Head className="bg-gray-100 text-gray-700">
            {["","เงินกู้ในประเทศ", "เงินรายได้", "เงินสมทบจากผู้ใช้ไฟ", "รวม"].map((label, idx) => (
              <Table.HeadCell key={`allocated-${idx}`} className="text-center">
                {label}
              </Table.HeadCell>
            ))}
            {["เงินกู้ในประเทศ", "เงินรายได้", "เงินสมทบจากผู้ใช้ไฟ", "รวม",""].map((label, idx) => (
              <Table.HeadCell key={`usage-${idx}`} className="text-center">
                {label}
              </Table.HeadCell>
            ))}
          </Table.Head>

          <Table.Body className="divide-y border border-gray-400">
            {projects.map((project) => {
              const year2569 = project.budgetPlan.find(
                (bp) => bp.year === 2569
              );

              const budgetAllocated = year2569?.budgetAllocated || {};
              const budgetUsage = year2569?.budgetUsage || {};

              const allocatedTotal =
                (budgetAllocated.ผูกพัน?.["เงินกู้"] || 0) +
                (budgetAllocated.ผูกพัน?.["เงินรายได้"] || 0) +
                (budgetAllocated.ลงทุน?.["เงินกู้"] || 0) +
                (budgetAllocated.ลงทุน?.["เงินรายได้"] || 0);

              const usageTotal =
                (budgetUsage.ผูกพัน?.["เงินกู้"] || 0) +
                (budgetUsage.ผูกพัน?.["เงินรายได้"] || 0) +
                (budgetUsage.ลงทุน?.["เงินกู้"] || 0) +
                (budgetUsage.ลงทุน?.["เงินรายได้"] || 0);

              return (
                <Table.Row key={project.projectId}>
                  <Table.Cell className="text-left border border-gray-400 px-4">
                    {project.projectName}
                  </Table.Cell>

                  {/* วงเงินขอตั้ง */}
                  <Table.Cell className="text-right border border-gray-400 px-4">
                    {formatNumber(budgetAllocated.ผูกพัน?.["เงินกู้"])}
                  </Table.Cell>
                  <Table.Cell className="text-right border border-gray-400 px-4">
                    {formatNumber(budgetAllocated.ผูกพัน?.["เงินรายได้"])}
                  </Table.Cell>
                  <Table.Cell className="text-right border border-gray-400 px-4">
                    {formatNumber(
                      (budgetAllocated.ลงทุน?.["เงินกู้"] || 0) +
                        (budgetAllocated.ลงทุน?.["เงินรายได้"] || 0)
                    )}
                  </Table.Cell>
                  <Table.Cell className="text-right border border-gray-400 px-4 font-semibold">
                    {formatNumber(allocatedTotal)}
                  </Table.Cell>

                  {/* เป้าหมายเบิกจ่าย */}
                  <Table.Cell className="text-right border border-gray-400 px-4">
                    {formatNumber(budgetUsage.ผูกพัน?.["เงินกู้"])}
                  </Table.Cell>
                  <Table.Cell className="text-right border border-gray-400 px-4">
                    {formatNumber(budgetUsage.ผูกพัน?.["เงินรายได้"])}
                  </Table.Cell>
                  <Table.Cell className="text-right border border-gray-400 px-4">
                    {formatNumber(
                      (budgetUsage.ลงทุน?.["เงินกู้"] || 0) +
                        (budgetUsage.ลงทุน?.["เงินรายได้"] || 0)
                    )}
                  </Table.Cell>
                  <Table.Cell className="text-right border border-gray-400 px-4 font-semibold">
                    {formatNumber(usageTotal)}
                  </Table.Cell>

                  <Table.Cell className="text-center border border-gray-400 px-4">
                    {project.departmentName}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default WaitingProjectPage;
