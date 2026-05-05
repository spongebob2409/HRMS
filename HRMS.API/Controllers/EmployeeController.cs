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
    public async Task<IActionResult> Create(Employee emp)
    {
        _context.Employees.Add(emp);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = emp.Id }, emp);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Employee emp)
    {
        if (id != emp.Id) return BadRequest();
        _context.Entry(emp).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
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