namespace HRMS.API.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Position { get; set; }
        public string Department { get; set; }
        public string AccountNumber { get; set; }
        public string EmploymentStatus { get; set; } // Active, Inactive
        public DateTime JoiningDate { get; set; }
        public Salary Salary { get; set; }
    }
}
