import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { getReviewedProjects } from "../../apis/UserProjectApi";
import { ProjectTable } from "../../interfaces/MainInterface";
import { IoPencil } from "react-icons/io5";
import React from "react";
import EditProjectModal from "../AdminEdit/EditProjectModal";
import { Link } from 'react-router-dom';

// ฟังก์ชันจัดรูปแบบตัวเลข
const formatNumber = (num: number) => num.toLocaleString();

const BudgetTable = () => {
  const [projects, setProjects] = useState<ProjectTable[]>([]);
  const [uniqueYears, setUniqueYears] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectTable | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");

  useEffect(() => {
    getReviewedProjects().then((data) => {
      setProjects(data);

      const years = data.flatMap((project: ProjectTable) => project.budgetPlan.map((bp) => bp.year));
      const uniqueYearsArray = Array.from(new Set<number>(years)).sort((a, b) => a - b);
      setUniqueYears(uniqueYearsArray);
    });
  }, []);

  const handleEditClick = (project: ProjectTable) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSaveEdit = (updatedProject: ProjectTable) => {
    setProjects((prevProjects) =>
      prevProjects.map((proj) => (proj.projectId === updatedProject.projectId ? updatedProject : proj))
    );
  };

  const filteredProjects = projects.filter(
    (project) => project.projectName.includes(searchQuery) && project.departmentName.includes(searchDepartment)
  );

  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold text-center mb-5">สรุปงบประมาณโครงการ (Admin)</h1>
      <h2 className="text-xl font-semibold text-center mb-5">ตารางงบประมาณ</h2>

      <Table striped>
        {/* หัวตาราง */}
        <Table.Head className="bg-gray-100 text-gray-700 text-center">
          <Table.HeadCell rowSpan={2} className="text-center border border-gray-400">
            แก้ไข
          </Table.HeadCell>
          <Table.HeadCell rowSpan={2} className="text-center border border-gray-400">
            ชื่อโครงการ <br /> <span className="text-sm text-gray-500">(เงินกู้ / เงินรายได้)</span>
          </Table.HeadCell>
          <Table.HeadCell rowSpan={2} className="text-center border border-gray-400">
            หน่วยงาน
          </Table.HeadCell>

          {uniqueYears.map((year) => (
            <React.Fragment key={`header-${year}`}>
              <Table.HeadCell colSpan={3} className="text-center border border-gray-400">
                {`งบประมาณปี ${year}`}
              </Table.HeadCell>
              <Table.HeadCell colSpan={3} className="text-center border border-gray-400">
                {`เป้าหมายเบิกจ่าย ${year}`}
              </Table.HeadCell>
              <Table.HeadCell rowSpan={2} className="text-center border border-gray-400">
                คงเหลือ
              </Table.HeadCell>
              <Table.HeadCell rowSpan={2} className="text-center border border-gray-400">
                ตัดทิ้ง
              </Table.HeadCell>
            </React.Fragment>
          ))}
        </Table.Head>

        {/* แถวกรอกค้นหา */}
        <Table.Head>
          <Table.HeadCell className="border border-gray-400"></Table.HeadCell>
          <Table.HeadCell className="border border-gray-400 px-2">
            <input
              type="text"
              className="w-full p-1 text-sm border border-gray-300 rounded"
              placeholder="🔍 ค้นหาชื่อโครงการ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Table.HeadCell>
          <Table.HeadCell className="border border-gray-400 px-2">
            <input
              type="text"
              className="w-full p-1 text-sm border border-gray-300 rounded"
              placeholder="🔍 ค้นหาหน่วยงาน..."
              value={searchDepartment}
              onChange={(e) => setSearchDepartment(e.target.value)}
            />
          </Table.HeadCell>

          {uniqueYears.map((year) => (
            <React.Fragment key={`subheader-${year}`}>
              <Table.HeadCell className="text-center border border-gray-400">ผูกพัน</Table.HeadCell>
              <Table.HeadCell className="text-center border border-gray-400">ลงทุน</Table.HeadCell>
              <Table.HeadCell className="text-center border border-gray-400">รวม</Table.HeadCell>
              <Table.HeadCell className="text-center border border-gray-400">ผูกพัน</Table.HeadCell>
              <Table.HeadCell className="text-center border border-gray-400">ลงทุน</Table.HeadCell>
              <Table.HeadCell className="text-center border border-gray-400">รวม</Table.HeadCell>
              <Table.HeadCell className="text-center border border-gray-400"></Table.HeadCell>
              <Table.HeadCell className="text-center border border-gray-400"></Table.HeadCell>
            </React.Fragment>
          ))}
        </Table.Head>

        {/* เนื้อหาตาราง */}
        <Table.Body className="divide-y border border-gray-400">
          {filteredProjects.map((project) => (
            <Table.Row key={project.projectId} className="border border-gray-400">
              {/* ปุ่มแก้ไข */}
              <Table.Cell className="text-center border border-gray-400 px-4">
                <Link to={`/editreport/${project.projectId}`} className="text-blue-600 hover:text-blue-800">
                  <IoPencil size={18} />
                </Link>
              </Table.Cell>

              {/* ชื่อโครงการ */}
              <Table.Cell className="text-left border border-gray-400 px-4 font-bold">
                {project.projectName}
                <div className="text-sm text-gray-600">
                  <span>เงินกู้: </span><br />
                  <span>เงินรายได้: </span>
                </div>
              </Table.Cell>

              {/* หน่วยงาน */}
              <Table.Cell className="text-left border border-gray-400 px-4">{project.departmentName}</Table.Cell>

              {/* วนตามปี */}
              {uniqueYears.map((year) => {
                const yearData = project.budgetPlan.find((bp) => bp.year === year);

                return yearData ? (
                  <React.Fragment key={`row-${project.projectId}-${year}`}>
                    {/* งบประมาณปี */}
                    <Table.Cell className="text-center border border-gray-400 px-4">
                      {formatNumber(yearData.budgetAllocated.ผูกพัน.เงินกู้ + yearData.budgetAllocated.ผูกพัน.เงินรายได้)}
                      <div className="text-sm text-gray-600">
                        {formatNumber(yearData.budgetAllocated.ผูกพัน.เงินกู้)}<br />
                        {formatNumber(yearData.budgetAllocated.ผูกพัน.เงินรายได้)}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-center border border-gray-400 px-4">
                      {formatNumber(yearData.budgetAllocated.ลงทุน.เงินกู้ + yearData.budgetAllocated.ลงทุน.เงินรายได้)}
                      <div className="text-sm text-gray-600">
                        {formatNumber(yearData.budgetAllocated.ลงทุน.เงินกู้)}<br />
                        {formatNumber(yearData.budgetAllocated.ลงทุน.เงินรายได้)}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-center border border-gray-400 px-4 font-bold">
                      {formatNumber(
                        yearData.budgetAllocated.ผูกพัน.เงินกู้ +
                        yearData.budgetAllocated.ผูกพัน.เงินรายได้ +
                        yearData.budgetAllocated.ลงทุน.เงินกู้ +
                        yearData.budgetAllocated.ลงทุน.เงินรายได้
                      )}
                      <div className="text-sm text-gray-600">
                        {formatNumber(yearData.budgetAllocated.ลงทุน.เงินกู้ + yearData.budgetAllocated.ผูกพัน.เงินกู้)}<br />
                        {formatNumber(yearData.budgetAllocated.ลงทุน.เงินรายได้ + yearData.budgetAllocated.ผูกพัน.เงินรายได้)}
                      </div>
                    </Table.Cell>

                    {/* เป้าหมายเบิกจ่ายปี */}
                    <Table.Cell className="text-center border border-gray-400 px-4">
                      {formatNumber(yearData.budgetUsage.ผูกพัน.เงินกู้ + yearData.budgetUsage.ผูกพัน.เงินรายได้)}
                      <div className="text-sm text-gray-600">
                        {formatNumber(yearData.budgetUsage.ผูกพัน.เงินกู้)}<br />
                        {formatNumber(yearData.budgetUsage.ผูกพัน.เงินรายได้)}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-center border border-gray-400 px-4">
                      {formatNumber(yearData.budgetUsage.ลงทุน.เงินกู้ + yearData.budgetUsage.ลงทุน.เงินรายได้)}
                      <div className="text-sm text-gray-600">
                        {formatNumber(yearData.budgetUsage.ลงทุน.เงินกู้)}<br />
                        {formatNumber(yearData.budgetUsage.ลงทุน.เงินรายได้)}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-center border border-gray-400 px-4 font-bold">
                      {formatNumber(
                        yearData.budgetUsage.ผูกพัน.เงินกู้ +
                        yearData.budgetUsage.ผูกพัน.เงินรายได้ +
                        yearData.budgetUsage.ลงทุน.เงินกู้ +
                        yearData.budgetUsage.ลงทุน.เงินรายได้
                      )}
                      <div className="text-sm text-gray-600">
                        {formatNumber(yearData.budgetUsage.ลงทุน.เงินกู้ + yearData.budgetUsage.ผูกพัน.เงินกู้)}<br />
                        {formatNumber(yearData.budgetUsage.ลงทุน.เงินรายได้ + yearData.budgetUsage.ผูกพัน.เงินรายได้)}
                      </div>
                    </Table.Cell>

                    {/* คงเหลือ */}
                    <Table.Cell className="text-center border border-gray-400 px-4">
                      {formatNumber(
                        (yearData.budgetAllocated.ผูกพัน.เงินกู้ +
                          yearData.budgetAllocated.ผูกพัน.เงินรายได้ +
                          yearData.budgetAllocated.ลงทุน.เงินกู้ +
                          yearData.budgetAllocated.ลงทุน.เงินรายได้) -
                        (yearData.budgetUsage.ผูกพัน.เงินกู้ +
                          yearData.budgetUsage.ผูกพัน.เงินรายได้ +
                          yearData.budgetUsage.ลงทุน.เงินกู้ +
                          yearData.budgetUsage.ลงทุน.เงินรายได้)
                      )}
                    </Table.Cell>

                    {/* ตัดทิ้ง (ตอนนี้ปล่อยว่าง) */}
                    <Table.Cell className="text-center border border-gray-400 px-4">-</Table.Cell>
                  </React.Fragment>
                ) : (
                  <React.Fragment key={`empty-${project.projectId}-${year}`}>
                    {Array(8).fill(null).map((_, idx) => (
                      <Table.Cell key={idx} className="border border-gray-400"></Table.Cell>
                    ))}
                  </React.Fragment>
                );
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <EditProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} project={selectedProject} onSave={handleSaveEdit} />
    </div>
  );
};

export default BudgetTable;
