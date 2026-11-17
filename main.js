// ============================================
// 1. Student Class & Encapsulation
// ============================================

class Student {

    // Private Fields
    #grades;
    #attendance;

    constructor(id, name, grades, attendance) {
        this.id = id;
        this.name = name;
        this.grades = grades;
        this.attendance = attendance;
    }

    // Grades Setter
    set grades(value) {

        if (!Array.isArray(value) || value.length !== 3) {
            throw new Error("Please enter exactly three grades.");
        }

        const validatedGrades = value.map(grade => {

            if (
                grade === "" ||
                grade === null ||
                grade === undefined ||
                !Number.isFinite(Number(grade))
            ) {
                throw new Error("All grades are required and must be valid numbers.");
            }

            const numberGrade = Number(grade);

            if (numberGrade < 0 || numberGrade > 100) {
                throw new Error("Grades must be between 0 and 100.");
            }

            return numberGrade;
        });

        this.#grades = validatedGrades;
    }

    // Grades Getter
    get grades() {
        return [...this.#grades];
    }

    // Attendance Setter
    set attendance(value) {

        if (
            value === "" ||
            value === null ||
            value === undefined ||
            !Number.isFinite(Number(value))
        ) {
            throw new Error("Attendance percentage is required.");
        }

        const numberAttendance = Number(value);

        if (numberAttendance < 0 || numberAttendance > 100) {
            throw new Error("Attendance must be between 0 and 100.");
        }

        this.#attendance = numberAttendance;
    }

    // Attendance Getter
    get attendance() {
        return this.#attendance;
    }

    // Calculate Average Using reduce()
    calculateAverage() {

        const total = this.#grades.reduce((sum, grade) => {
            return sum + grade;
        }, 0);

        return total / this.#grades.length;
    }

    // Calculate Letter Grade
    calculateGrade() {

        const average = this.calculateAverage();

        if (average >= 90) {
            return "A";
        } else if (average >= 80) {
            return "B";
        } else if (average >= 70) {
            return "C";
        } else if (average >= 60) {
            return "D";
        } else if (average >= 50) {
            return "E";
        } else {
            return "F";
        }
    }

    // Check Final Result
    getFinalResult() {

        const average = this.calculateAverage();

        if (average >= 50 && this.#attendance >= 75) {
            return "Passed";
        } else {
            return "Needs Review";
        }
    }
}


// ============================================
// 2. Students Array
// ============================================

const studentsList = [];

let studentId = 1;


// ============================================
// 3. Get HTML Elements Using DOM
// ============================================

const studentNameInput = document.getElementById("studentName");

const grade1Input = document.getElementById("grade1");
const grade2Input = document.getElementById("grade2");
const grade3Input = document.getElementById("grade3");

const attendanceInput = document.getElementById("attendance");

const studentForm = document.getElementById("studentForm");

const studentsContainer = document.getElementById("studentsList");

const errorBox = document.getElementById("errorBox");

const studentCount = document.getElementById("studentCount");

const mercyBtn = document.getElementById("mercyBtn");

const mercyReport = document.getElementById("mercyReport");


// ============================================
// 4. HTML Protection Function
// ============================================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}


// ============================================
// 5. Display Students On The Screen
// ============================================

function displayStudents() {

    studentsContainer.innerHTML = "";

    if (studentsList.length === 0) {

        studentsContainer.innerHTML = 
        `
            <p class="text-muted text-center py-4">
                No students added yet.
            </p>
        `;

        studentCount.textContent = "0 Students";

        return;
    }

    studentsList.forEach(student => {

        const studentDiv = document.createElement("div");

        studentDiv.className = "student-item";

        studentDiv.innerHTML = `

            <div class="d-flex justify-content-between flex-wrap gap-2">

                <div>

                    <h6 class="fw-bold mb-2">
                        ${escapeHTML(student.name)}
                    </h6>

                    <small class="text-muted">
                        Student ID: ${student.id}
                    </small>

                </div>

                <div class="text-end">

                    <strong>
                        Average: ${student.calculateAverage().toFixed(2)}
                    </strong>

                    <br>

                    <small>
                        Grade: ${student.calculateGrade()}
                    </small>

                </div>

            </div>

            <div class="mt-2">

                <small class="text-muted">
                    Attendance: ${student.attendance}%
                </small>

                <span class="badge ${
                    student.getFinalResult() === "Passed"
                    ? "bg-success"
                    : "bg-warning text-dark"
                } ms-2">

                    ${student.getFinalResult()}

                </span>

            </div>
        `; 

        studentsContainer.appendChild(studentDiv);

    });

    studentCount.textContent = `
        ${studentsList.length} Students`;
}


// ============================================
// 6. Add Student Using Try & Catch
// ============================================

studentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    try {

        // Get Input Values
        const name = studentNameInput.value.trim();

        const grades = [
            grade1Input.value,
            grade2Input.value,
            grade3Input.value
        ];

        const attendance = attendanceInput.value;

        // Validate Student Name
        if (name === "") {
            throw new Error("Please enter the student name.");
        }

        // Create New Student Object
        const newStudent = new Student(
            studentId,
            name,
            grades,
            attendance
        );

        // Add Student To Array
        studentsList.push(newStudent);

        studentId++;

        // Clear Error Message
        errorBox.textContent = "";
        errorBox.classList.add("d-none");

        // Display Students
        displayStudents();

        // Clear Input Fields
        studentForm.reset();

        // Reset Previous Mercy Report
        mercyReport.innerHTML = 
            <p class="text-muted">
                The report will be updated when you activate
                the Mercy Committee.
            </p>
        ;

    }

    catch(error) {

        // Display Error Message
        errorBox.textContent = error.message;

        errorBox.classList.remove("d-none");
    }

});


// ============================================
// 7. Mercy Committee - Filter
// ============================================

mercyBtn.addEventListener("click", function() {

    // Extract Students With Averages Between 40 And 49

    const strugglingStudents = studentsList.filter(student => {

        const average = student.calculateAverage();
        return average >= 40 && average <= 49;

    });


    // ========================================
    // 8. Mercy Committee - Map
    // ========================================

    const studentsAfterMercy = strugglingStudents.map(student => {

        const oldAverage = student.calculateAverage();

        const newAverage = oldAverage + 5;

        return {
            name: student.name,
            oldAverage: oldAverage,
            newAverage: newAverage
        };

    });


    // ========================================
    // 9. Mercy Committee - Reduce
    // ========================================

    const totalNewAverages = studentsAfterMercy.reduce(
        (sum, student) => {

            return sum + student.newAverage;

        },
        0
    );


    // ========================================
    // 10. Calculate General Average
    // ========================================

    const generalAverage = studentsAfterMercy.length > 0
        ? totalNewAverages / studentsAfterMercy.length
        : 0;


    // ========================================
    // 11. Display Empty Report If No Students
    // ========================================

    if (studentsAfterMercy.length === 0) {

        mercyReport.innerHTML = `

            <div class="alert alert-info">

                <h5>No Struggling Students Found</h5>

                <p class="mb-0">
                    There are no students with averages
                    between 40 and 49.
                </p>

            </div>

        `;

        return;
    }


    // ========================================
    // 12. Create Students HTML Using map()
    // ========================================

    const studentsHTML = studentsAfterMercy.map(student => {

        return `

            <div class="report-student">

                <h6 class="fw-bold">
                    ${escapeHTML(student.name)}
                </h6>

                <p class="mb-1">
                    Original Average:
                    ${student.oldAverage.toFixed(2)}
                </p>

                <p class="mb-0 text-success">

                    New Average After Mercy:

                    <strong>
                        ${student.newAverage.toFixed(2)}
                    </strong>

                </p>

            </div>

        `;

    }).join("");


    // ========================================
    // 13. Display Final Mercy Report
    // Using Template Literals
    // ========================================

    mercyReport.innerHTML = `

        <div class="report-box">

            <h4 class="mb-3">
                Final Mercy Committee Report
            </h4>

            <p>

                <strong>
                    Number of Struggling Students:
                </strong>

                ${studentsAfterMercy.length}

            </p>

            <h5 class="mt-4 mb-3">
                Students Included In Mercy Committee:
            </h5>

            ${studentsHTML}

            <hr>

            <h5 class="text-success">
                General Average After Mercy:
            </h5>

            <h2 class="fw-bold">
                ${generalAverage.toFixed(2)}
            </h2>

        </div>

    `;

});


// ============================================
// 14. Initial Display
// ============================================

displayStudents();
