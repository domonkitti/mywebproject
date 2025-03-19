import { Modal, Button, Label, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { ProjectTable } from "../../interfaces/MainInterface";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectTable | null;
  onSave: (updatedProject: ProjectTable) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, project, onSave }) => {
  const [editedProjectName, setEditedProjectName] = useState("");
  const [editedDepartmentName, setEditedDepartmentName] = useState("");

  // ✅ เก็บงบประมาณที่แก้ไขใน state (สร้าง array ใหม่จาก project.budgetPlan)
  const [editedBudgetPlan, setEditedBudgetPlan] = useState<ProjectTable["budgetPlan"]>([]);

  // ✅ โหลดข้อมูลเข้าไปในฟอร์มเมื่อเปิด Modal
  useEffect(() => {
    if (project) {
      setEditedProjectName(project.projectName);
      setEditedDepartmentName(project.departmentName);

      // ✅ คัดลอก `budgetPlan` เข้า state เพื่อแก้ไข
      setEditedBudgetPlan(project.budgetPlan.map((bp) => ({
        ...bp,
        budgetUsage: { ...bp.budgetUsage }
      })));
    }
  }, [project]);

  // ✅ อัปเดตค่าตัวเลขใน `budgetPlan`
  const handleBudgetChange = (index: number, field: "ผูกพัน" | "ลงทุน", value: string) => {
    const newBudgetPlan = [...editedBudgetPlan];
    newBudgetPlan[index].budgetUsage[field] = parseInt(value) || 0;
    setEditedBudgetPlan(newBudgetPlan);
  };

  // ✅ กดบันทึก → ส่งค่าที่แก้ไขกลับไปที่ Table
  const handleSave = () => {
    if (project) {
      onSave({
        ...project,
        projectName: editedProjectName,
        departmentName: editedDepartmentName,
        budgetPlan: editedBudgetPlan, // ✅ ส่งค่าที่แก้ไขกลับไป
      });
      onClose(); // ปิด Modal
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} className="backdrop-blur-md bg-gray-800/60">
      <Modal.Header className="bg-gray-200 shadow-md">แก้ไขข้อมูลโครงการ</Modal.Header>
      <Modal.Body className="shadow-lg border border-gray-300 bg-white">
        <div className="space-y-4">
          {/* ✅ แก้ไขชื่อโครงการ */}
          <div>
            <Label htmlFor="projectName" value="ชื่อโครงการ" />
            <TextInput
              id="projectName"
              value={editedProjectName}
              onChange={(e) => setEditedProjectName(e.target.value)}
              required
            />
          </div>
          {/* ✅ แก้ไขหน่วยงาน */}
          <div>
            <Label htmlFor="departmentName" value="หน่วยงาน" />
            <TextInput
              id="departmentName"
              value={editedDepartmentName}
              onChange={(e) => setEditedDepartmentName(e.target.value)}
              required
            />
          </div>

          {/* ✅ ฟอร์มแก้ไขงบประมาณ */}
          <div>
            <h3 className="text-lg font-semibold">แก้ไขงบประมาณ</h3>
            {editedBudgetPlan.map((yearData, index) => (
              <div key={yearData.year} className="border p-2 rounded-lg shadow-sm mb-2">
                <h4 className="font-semibold">{`ปี ${yearData.year}`}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`budgetผูกพัน-${index}`} value="งบผูกพัน" />
                    <TextInput
                      id={`budgetผูกพัน-${index}`}
                      type="number"
                      value={yearData.budgetUsage.ผูกพัน}
                      onChange={(e) => handleBudgetChange(index, "ผูกพัน", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`budgetลงทุน-${index}`} value="งบลงทุน" />
                    <TextInput
                      id={`budgetลงทุน-${index}`}
                      type="number"
                      value={yearData.budgetUsage.ลงทุน}
                      onChange={(e) => handleBudgetChange(index, "ลงทุน", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="red" onClick={handleSave}>บันทึก</Button>
        <Button color="gray" onClick={onClose}>ยกเลิก</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProjectModal;
