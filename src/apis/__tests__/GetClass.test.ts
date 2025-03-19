import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getClasss } from '../AllClass'
import { ClassForFrontEnd } from '../../interfaces/MainInterface'

const mockResponse = {
  data: [
    {
      class_id: 1,
      course_name: 'Product Discovery',
      class_name: '',
      start_date: '2024-11-06T00:00:00Z',
      end_date: '2024-11-13T00:00:00Z',
      max_participant: 30,
      trainer_nickname: ['K.Chanita', 'K.Peerawat'],
      class_participant: [
        { participant_id: 1, is_email_sent: true },
        { participant_id: 2, is_email_sent: true }
      ]
    },
    {
      class_id: 2,
      course_name: 'Introduction to Agile and Scrum',
      class_name: '',
      start_date: '2024-11-12T00:00:00Z',
      end_date: '2024-11-17T00:00:00Z',
      max_participant: 20,
      trainer_nickname: ['รูฟ', 'แอร์'],
      class_participant: [
        { participant_id: 3, is_email_sent: false },
        { participant_id: 4, is_email_sent: false }
      ]
    }
  ]
}

// Mock the fetch function using `vi.fn()`
global.fetch = vi.fn(async () => ({
  json: async () => mockResponse
})) as unknown as typeof fetch

describe('getClasss function', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch and transform data correctly', async () => {
    const result: ClassForFrontEnd[] = await getClasss()

    // Validate the length of the transformed data
    expect(result).toHaveLength(2)

    // Validate the transformation of the first item
    expect(result[0]).toEqual({
      classId: 1,
      courseName: 'Product Discovery',
      classCourseName: '',
      startDate: new Date('2024-11-06T00:00:00Z'),
      endDate: new Date('2024-11-13T00:00:00Z'),
      maxParticipant: 30,
      instructorName: ['K.Chanita', 'K.Peerawat'],
      userIdCount: 2,
      isAllEmailSent: true // Updated to match the mock data
    })

    // Validate the transformation of the second item
    expect(result[1]).toEqual({
      classId: 2,
      courseName: 'Introduction to Agile and Scrum',
      classCourseName: '',
      startDate: new Date('2024-11-12T00:00:00Z'),
      endDate: new Date('2024-11-17T00:00:00Z'),
      maxParticipant: 20,
      instructorName: ['รูฟ', 'แอร์'],
      userIdCount: 2,
      isAllEmailSent: false
    })
  })
})
