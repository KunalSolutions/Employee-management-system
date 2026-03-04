import PDFDocument from "pdfkit";
import Salary from "../models/salaryModel.js";
import User from "../models/userModel.js";


// ✅ 1. Create Salary + Generate PDF
export const createSalary = async (req, res) => {
  try {
    const { id } = req.params; // employee id
    const { month, year, basicSalary, bonus, deduction, notes } = req.body;

    const employee = await User.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check duplicate salary for same month
    const existingSalary = await Salary.findOne({
      employee: id,
      month,
      year,
    });

    if (existingSalary) {
      return res
        .status(400)
        .json({ message: "Salary already generated for this month" });
    }

    const netSalary =
      Number(basicSalary) + Number(bonus || 0) - Number(deduction || 0);

    // Save salary in DB
    const salary = await Salary.create({
      employee: id,
      month,
      year,
      basicSalary,
      bonus,
      deduction,
      netSalary,
      notes,
      generatedBy: req.user._id,
    });

    // ---- Generate PDF ----
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${employee.name}-${month}-${year}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("SALARY SLIP", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Employee Name: ${employee.name}`);
    doc.text(`Email: ${employee.email}`);
    doc.text(`Month: ${month} ${year}`);
    doc.moveDown();

    doc.text(`Basic Salary: ₹ ${basicSalary}`);
    doc.text(`Bonus: ₹ ${bonus}`);
    doc.text(`Deduction: ₹ ${deduction}`);
    doc.moveDown();

    doc.fontSize(14).text(`Net Salary: ₹ ${netSalary}`, {
      underline: true,
    });

    doc.moveDown();
    doc.fontSize(10).text(`Notes: ${notes || "N/A"}`);

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ 2. Get Salary History of Employee
export const getSalaryByEmployee = async (req, res) => {
  try {
    const salaries = await Salary.find({
      employee: req.params.id,
    }).sort({ createdAt: -1 });

    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ 3. Download Existing Salary Slip Again
export const downloadSalarySlip = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.salaryId).populate(
      "employee"
    );

    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${salary.employee.name}-${salary.month}-${salary.year}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("SALARY SLIP", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Employee Name: ${salary.employee.name}`);
    doc.text(`Email: ${salary.employee.email}`);
    doc.text(`Month: ${salary.month} ${salary.year}`);
    doc.moveDown();

    doc.text(`Basic Salary: ₹ ${salary.basicSalary}`);
    doc.text(`Bonus: ₹ ${salary.bonus}`);
    doc.text(`Deduction: ₹ ${salary.deduction}`);
    doc.moveDown();

    doc.fontSize(14).text(`Net Salary: ₹ ${salary.netSalary}`, {
      underline: true,
    });

    doc.moveDown();
    doc.fontSize(10).text(`Notes: ${salary.notes || "N/A"}`);

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
