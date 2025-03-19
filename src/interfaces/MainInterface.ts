export interface ProjectAPI {
  project_id: string;
  project_name: string;
  department_name: string;
  start_date: string;
  end_date: string;
  budget_total: number;
  budget_used: number;
  manager_name: string | string[];
  is_approved: boolean;
  status:string;
}

export interface ProjectForFrontEnd {
  projectId: string;
  projectName: string;
  departmentName: string;
  startDate: Date;
  endDate: Date;
  budgetTotal: number;
  budgetUsed: number;
  managerName: string[];
  isApproved: boolean;
  status:string;
}

export interface ProjectTable {
  projectId: string; // รหัสโครงการ
  projectName: string; // ชื่อโครงการ
  departmentName: string; // ชื่อหน่วยงาน
  budgetPlan: BudgetYear[]; // แผนงบประมาณรายปี
}

interface BudgetYear {
  year: number; // ปีงบประมาณ
  budgetAllocated: BudgetCategory; // งบประมาณที่จัดสรร
  budgetUsage: BudgetCategory; // งบประมาณที่ใช้ไป
}

interface BudgetCategory {
  ผูกพัน: number; // งบประมาณผูกพัน
  ลงทุน: number; // งบประมาณลงทุน
}
