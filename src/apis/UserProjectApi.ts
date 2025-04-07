const REQUESTS_URL = "http://localhost:5000";
const REVIEW_URL = "http://localhost:5001";

//ของจริง
export async function createProject(data) {
  const response = await fetch("http://localhost:2024/projects/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "เกิดข้อผิดพลาดในการสร้างโครงการ");
  }

  return response.json();
}

// ✅ ดึงโครงการที่ User ตั้งงบ
export const getProjectRequests = async () => {
  const response = await fetch("http://localhost:2024/projects/allrequested");
  return response.json();
};
//อันนี้ยากสุดละ เป็นเกินกู้เงินรายได้
export async function saveBudgetRequests(subProjectId: number, data: any[]) {
  const response = await fetch(`http://localhost:2024/projects/savebudgetrequests/${subProjectId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  }

  return response.json();
}

//เอาไปใช้หน้า  main กับ detail
export const getBudgetRequests = async (subProjectId: number, requestedYear?: number) => {
  const queryParam = requestedYear !== undefined && requestedYear !== null
    ? `?requestedYear=${requestedYear}`
    : "";

  const response = await fetch(`http://localhost:2024/projects/getbudgetrequests/${subProjectId}${queryParam}`);

  if (!response.ok) {
    throw new Error("ไม่สามารถดึงข้อมูล budget requests ได้");
  }

  return response.json();
};

//summary
export async function getBudgetRequestsByProject(projectId: number) {
  const response = await fetch(`http://localhost:2024/projects/getbudgetrequestsbyproject/${projectId}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
  }

  return response.json();
}
























//---------------------mock------------------
// ✅ ดึงโครงการที่ Admin กำลังพิจารณา (เฉพาะ `"reviewing"`)
export const getReviewedProjects = async () => {
  const response = await fetch(`${REVIEW_URL}/ReviewedProjects`);
  const data = await response.json();
  return data.filter((project: any) => project.status === "รอดำเนินการ");
};



// ✅ Admin กด Approve → คัดลอกข้อมูลไป `db_review.json` และอัปเดตสถานะ
export const approveProject = async (project: any) => {
  // เปลี่ยน Status เป็น "รอดำเนินการ" ใน `requests.json`
  await fetch(`${REQUESTS_URL}/ProjectRequests/${project.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "รอดำเนินการ" }),
  });

  // คัดลอกข้อมูลไป `reviews.json`
  await fetch(`${REVIEW_URL}/ReviewedProjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...project, status: "รอดำเนินการ" }),
  });
};




// ✅ Admin กด Approve อีกครั้ง → เปลี่ยนเป็น "รอดำเนินการ"
export const confirmProject = async (projectId: number) => {
  await fetch(`${REVIEW_URL}/ReviewedProjects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "รอดำเนินการ" }),
  });
};

export const rejectProject = async (projectId: string) => {
  await fetch(`${REQUESTS_URL}/ProjectRequests/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "ปฏิเสธ" }),
  });
};

