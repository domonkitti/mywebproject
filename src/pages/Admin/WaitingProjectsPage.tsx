import { useEffect, useState } from "react";
import { Button, Table } from "flowbite-react";
import { getReviewedProjects } from "../../apis/ProjectApi";
import { ProjectForFrontEnd } from "../../interfaces/MainInterface";
import dayjs from "dayjs";
import { HiEye } from "react-icons/hi";

const formatDate = (date: Date | string) => dayjs(date).format("DD/MM/YYYY");

const WaitingProjectPage = () => {
  const [projects, setProjects] = useState<ProjectForFrontEnd[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getReviewedProjects();

        console.log("Raw API Response:", data);

        const filteredData = data
          .filter((proj: ProjectForFrontEnd) => proj.status === "รอดำเนินการ")
          .map((proj: ProjectForFrontEnd) => ({ ...proj }));

        console.log("Filtered Projects:", filteredData);
        setProjects(filteredData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Sum the total budgetAllocated across all years of a single project
  const getTotalAllocated = (project: ProjectForFrontEnd) => {
    if (!project.budgetPlan) return 0;
    return project.budgetPlan.reduce((total, bp) => {
      const { ผูกพัน, ลงทุน } = bp.budgetAllocated || {};
      const sumผูกพัน = (ผูกพัน?.เงินกู้ || 0) + (ผูกพัน?.เงินรายได้ || 0);
      const sumลงทุน = (ลงทุน?.เงินกู้ || 0) + (ลงทุน?.เงินรายได้ || 0);
      return total + sumผูกพัน + sumลงทุน;
    }, 0);
  };

  // Sum the budgetUsage for year 2569 in a single project
  const getTarget2569 = (project: ProjectForFrontEnd) => {
    if (!project.budgetPlan) return 0;
    const bp2569 = project.budgetPlan.find((bp) => bp.year === 2569);
    if (!bp2569) return 0; // no plan for year 2569 => show 0

    const { ผูกพัน, ลงทุน } = bp2569.budgetUsage || {};
    const sumผูกพัน = (ผูกพัน?.เงินกู้ || 0) + (ผูกพัน?.เงินรายได้ || 0);
    const sumลงทุน = (ลงทุน?.เงินกู้ || 0) + (ลงทุน?.เงินรายได้ || 0);
    return sumผูกพัน + sumลงทุน;
  };

  // 🔹 Compute grand totals across *all* projects:
  const grandTotalBudget = projects.reduce(
    (acc, p) => acc + getTotalAllocated(p), 0
  );
  const grandTotal2569 = projects.reduce(
    (acc, p) => acc + getTarget2569(p), 0
  );

  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold text-center mb-10">โครงการที่รอดำเนินการ</h1>

      {isLoading ? (
        <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
      ) : projects.length === 0 ? (
        <p className="text-center text-gray-500">ไม่มีโครงการที่รอดำเนินการ</p>
      ) : (
        <Table striped>
          {/* Table Header */}
          <Table.Head className="bg-gray-100 text-gray-700">
            <Table.HeadCell className="text-center">ชื่อโครงการ</Table.HeadCell>
            <Table.HeadCell className="text-center">หน่วยงาน</Table.HeadCell>
            <Table.HeadCell className="text-center">งบประมาณ</Table.HeadCell>
            <Table.HeadCell className="text-center">เป้าหมายเบิกจ่าย 2569</Table.HeadCell>
            <Table.HeadCell className="text-center">Action</Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y border border-gray-400">
            {/* 🔹 Sum row at the TOP (below the header) */}
            <Table.Row className="bg-gray-50 font-semibold">
              <Table.Cell className="text-center border border-gray-400 px-4" colSpan={2}>
                รวมทั้งหมด
              </Table.Cell>
              {/* Grand total งบประมาณ */}
              <Table.Cell className="text-right border border-gray-400 px-4">
                {grandTotalBudget.toLocaleString()} บาท
              </Table.Cell>
              {/* Grand total เป้าหมายเบิกจ่าย 2569 */}
              <Table.Cell className="text-right border border-gray-400 px-4">
                {grandTotal2569.toLocaleString()} บาท
              </Table.Cell>
              <Table.Cell className="border border-gray-400 px-4"></Table.Cell>
            </Table.Row>

            {/* 🔹 Now map the individual rows for each project */}
            {projects.map((project) => {
              const totalAllocated = getTotalAllocated(project);
              const target2569 = getTarget2569(project);

              return (
                <Table.Row key={project.projectId} className="border border-gray-400">
                  <Table.Cell className="text-left border border-gray-400 px-4">
                    {project.projectName}
                  </Table.Cell>
                  <Table.Cell className="text-left border border-gray-400 px-4">
                    {project.departmentName}
                  </Table.Cell>

                  {/* งบประมาณ => sum of all years' allocated */}
                  <Table.Cell className="text-right border border-gray-400 px-4">
                    {totalAllocated.toLocaleString()} บาท
                  </Table.Cell>

                  {/* เป้าหมายเบิกจ่าย 2569 */}
                  <Table.Cell className="text-right border border-gray-400 px-4">
                    {target2569.toLocaleString()} บาท
                  </Table.Cell>

                  {/* Action buttons */}
                  <Table.Cell className="text-center border border-gray-400 px-4">
                    <button className="bg-blue-200 px-2 py-1 rounded mr-2 hover:bg-blue-300">
                      ให้หน่วยงานแก้ไข
                    </button>
                    <button className="bg-yellow-200 px-2 py-1 rounded mr-2 hover:bg-yellow-300">
                      แก้ไขเอง
                    </button>
                    <button className="bg-green-200 px-2 py-1 rounded hover:bg-green-300">
                      ดูรายละเอียด
                    </button>
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
