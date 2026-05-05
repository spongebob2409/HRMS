namespace HRMS.API.Models
{
    public class Payroll
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal GrossSalary { get; set; }
        public decimal TaxDeduction { get; set; }
        public decimal NetSalary { get; set; }
        public DateTime GeneratedDate { get; set; }
        public Employee Employee { get; set; }
    }
}