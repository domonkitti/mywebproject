import { test, expect } from '@playwright/test';

test.describe('Class Table Verification (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    const fixedDate = new Date(2024, 10, 14).getTime();

    await page.addInitScript(({ fixedDate }) => {
      const now = fixedDate;
      Date.now = () => now;
    }, { fixedDate });

    await page.goto('http://localhost:5173/AllClass');
  });

  test('should display correct table headers', async ({ page }) => {
    const expectedHeaders = [
      'ID', 'Class', 'Course', 'Start Date', 'End Date', 
      'Instructors', 'Participants', 'Status', ''
    ];

    await expect(page.locator('#tableheader thead .text-center')).toHaveText(expectedHeaders);
  });

  test('should display correct data for each class row', async ({ page }) => {
    const expectedRows = [
      {
        classId: '3',
        classCourseName: 'Service Design Advance',
        courseName: 'Introduction to Agile and scrum',
        startDate: '22/11/2024',
        endDate: '29/11/2024',
        instructors: ['เจน'], 
        participant: '1/25',
        status: 'Upcoming'
      },
      {
        classId: '2',
        classCourseName: 'Service Design',
        courseName: 'Introduction to Agile and scrum',
        startDate: '13/11/2024',
        endDate: '18/11/2024',
        instructors: ['รูฟ', 'แอร์'], 
        participant: '8/20',
        status: 'Ongoing'
      },
      {
        classId: '1',
        classCourseName: 'Product Discovery',
        courseName: 'Product Discovery',
        startDate: '07/11/2024',
        endDate: '14/11/2024',
        instructors: ['K.Chanita', 'K.Peerawat'],
        participant: '4/30',
        status: 'Done'
      }
    ];

    for (const row of expectedRows) {
      const { classId, classCourseName, courseName, startDate, endDate, instructors, participant, status } = row;
      const rowSelector = `[data-testid="row-${classId}"]`;


      await expect(page.locator(`${rowSelector} #classid`)).toHaveText(classId);
      await expect(page.locator(`${rowSelector} #classname`)).toHaveText(classCourseName);
      await expect(page.locator(`${rowSelector} #course`)).toHaveText(courseName);
      await expect(page.locator(`${rowSelector} #startdate`)).toHaveText(startDate);
      await expect(page.locator(`${rowSelector} #enddate`)).toHaveText(endDate);
      for (let i = 0; i < instructors.length; i++) {
        await expect(page.locator(`${rowSelector} #instructors div`).nth(i)).toHaveText(instructors[i]);
      }
    
      await expect(page.locator(`${rowSelector} #participant`)).toHaveText(participant);
      await expect(page.locator(`${rowSelector} #status`)).toHaveText(status);
    }
  });
});
