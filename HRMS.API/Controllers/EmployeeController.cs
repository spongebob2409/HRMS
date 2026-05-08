using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HRMS.API.Data;
using HRMS.API.Models;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeeController : ControllerBase
{
    private readonly AppDbContext _context;
    public EmployeeController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search)
    {
        var query = _context.Employees.AsQueryable();
        if (!string.IsNullOrEmpty(search))
            query = query.Where(e => e.Name.Contains(search) || e.Department.Contains(search));
        return Ok(await query.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id) =>
        Ok(await _context.Employees.FindAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] EmployeeDto dto)
    {
        var emp = new Employee {
            Name = dto.Name ?? "",
            Email = dto.Email ?? "",
            Phone = dto.Phone ?? "",
            Position = dto.Position ?? "",
            Department = dto.Department ?? "",
            AccountNumber = dto.AccountNumber ?? "",
            EmploymentStatus = dto.EmploymentStatus ?? "Active",
            JoiningDate = DateTime.Now
        };
        _context.Employees.Add(emp);
        await _context.SaveChangesAsync();
        return Ok(emp);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] EmployeeDto dto)
    {
        var emp = await _context.Employees.FindAsync(id);
        if (emp == null) return NotFound();
        emp.Name = dto.Name ?? emp.Name;
        emp.Email = dto.Email ?? emp.Email;
        emp.Phone = dto.Phone ?? emp.Phone;
        emp.Position = dto.Position ?? emp.Position;
        emp.Department = dto.Department ?? emp.Department;
        emp.AccountNumber = dto.AccountNumber ?? emp.AccountNumber;
        emp.EmploymentStatus = dto.EmploymentStatus ?? emp.EmploymentStatus;
        await _context.SaveChangesAsync();
        return Ok(emp);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var emp = await _context.Employees.FindAsync(id);
        if (emp == null) return NotFound();
        _context.Employees.Remove(emp);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class EmployeeDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Position { get; set; }
    public string? Department { get; set; }
    public string? AccountNumber { get; set; }
    public string? EmploymentStatus { get; set; }
}