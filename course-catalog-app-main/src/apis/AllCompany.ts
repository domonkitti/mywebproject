import ApiUrl from '../configs/ApiConfig';
import { Company } from '../interfaces/MainInterface'

interface companyBackend {
  company_id: number;
  codename: string;
  fullname: string;
}
export default async function FetchCompanies(): Promise<Company[]> {
  try {
    const response = await fetch(`${ApiUrl.baseurl}/v1/companies/`)
    const preparedata = await response.json()
    const data: Company[] = preparedata.data.map((company: companyBackend) => ({
      companyId: company.company_id,
      codeName: company.codename,
      fullName: company.fullname
    }))
    return data // Return the data array
  } catch (error) {
    console.error('Error fetching companies:', error)
    return [] // Return an empty array in case of an error
  }
}
