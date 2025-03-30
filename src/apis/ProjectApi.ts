const REQUESTS_URL = "http://localhost:5000";
const REVIEW_URL = "http://localhost:5001";

// ✅ ดึงโครงการที่ User ตั้งงบ
export const getProjectRequests = async () => {
  const response = await fetch(`${REQUESTS_URL}/ProjectRequests`);
  return response.json();
};

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

