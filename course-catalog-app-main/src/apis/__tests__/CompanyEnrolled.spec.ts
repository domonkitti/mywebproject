import { expect, test } from 'vitest'
import { getEnrolled } from '../CompanyEnrolled'

test('should get CompanyEnrolled ', async () => {
  const response = await getEnrolled()
  console.log(response)
  expect(response).toEqual([
    {
      companyId: 4,
      companyName: 'Advanced Info Service',
      codeName: 'AIS',
      totalCourses: 0
    },
    {
      companyId: 10,
      companyName: 'Bangkok Dusit Medical Services',
      codeName: 'BDMS',
      totalCourses: 0
    },
    {
      companyId: 9,
      companyName: 'Bank of Ayudhya (Krungsri)',
      codeName: 'BAY',
      totalCourses: 0
    },
    {
      companyId: 6,
      companyName: 'CP All Public Company Limited',
      codeName: 'CPALL',
      totalCourses: 0
    },
    {
      companyId: 2,
      companyName: 'Electricity Generating Authority of Thailand',
      codeName: 'EGAT',
      totalCourses: 1
    },
    {
      companyId: 8,
      companyName: 'Kasikorn Bank',
      codeName: 'KBANK',
      totalCourses: 0
    },
    {
      companyId: 1,
      companyName: 'Provincial Electricity Authority',
      codeName: 'PEA',
      totalCourses: 2
    },
    {
      companyId: 3,
      companyName: 'PTT Public Company Limited',
      codeName: 'PTT',
      totalCourses: 0
    },
    {
      companyId: 7,
      companyName: 'Siam Commercial Bank',
      codeName: 'SCB',
      totalCourses: 0
    },
    {
      companyId: 5,
      companyName: 'True Corporation',
      codeName: 'TRUE',
      totalCourses: 0
    }
  ])
})
