export interface CountryType {
  id: number
  shortname: string
  fullname: string
  thainame: string
  abbriviation: string
}

export interface SalaryGroupType {
  id: number
  salarygroup: string
  minvalue: number
  maxvalue: number
  note: string
}

export interface EducationLevelType {
  id: number
  level: string
}

export interface UniversityType {
  country: string
  state: string
  name: string
  localname: string
  place: string
}
