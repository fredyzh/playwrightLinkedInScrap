export const exclusiveKeyWorkds = new Set<string>([
    "PHP",
    "Full Stack".toUpperCase(),
    "Full-Stack".toUpperCase(),
    "AWS",
    "Zelle".toUpperCase(),
    "React".toUpperCase(),
    "Principal".toUpperCase(),
    "Staff".toUpperCase(),
    "Data Engineer".toUpperCase(),
    ".NET".toUpperCase(),
    "Mainframe".toUpperCase(),  
    "Embedded".toUpperCase(),
    "Firmware".toUpperCase(),
    "SYSTEM ENGINEER",
    "SERVICENOW",
    "ANDROID", 
    "SYSTEMS",
    "SYSTEM", 
    "SOLUTIONS",
    "SOLUTION",
    "MOBILE",
    "CLOUD",
    "DATABASE",
    "Infrastructure".toUpperCase(),
    "RUST",
    "REACT",
    "C++",
    "C#",
    "KOTLIN",
    "DEVOPS",
    "PYTHON",
    "SHELL",
    "GITHUB",
    "AZURE",
    "MACHINE LEARNING",
    "DATA ENGINEERING",
    "SCALA",
    "ASSEMBLY",
    "SIEBEL",
    "NODE.JS",
  ]);

  export interface JobFilteredList { 
    jobName: string;
    jobLink: string;
    jobCompanyAt: string;
    jobRepostedDiv: string [];
    jobPreferSkills: string [];
    jobappliedtotal: number;
  }

  export const currentDate = (): string => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  export const linkedinUrl= "https://www.linkedin.com/";