export interface ICareer {
  id: string;
  image: string;
  title: string;
  salaryRange: string;
  description: string;
  vacancy: number;
  location: string;
  deadline: string;
  status: boolean;
  experience: string;
  createdAt: string;
  actions?: string;
}

export interface IApplicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  resumeUrl: string;
  createdAt: string;
  action?: string;
  resume?: string;
}
