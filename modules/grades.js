let gradeData = [];
function renderGrades (gradeList){
    if (!gradeData.length) {
        gradeList.innerHTML = '<div class="text-center fw-bold">Оценки отсутствуют.</div>';
        return;
    }
    gradeList.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'table table-hover';
    const thead = document.createElement('thead');
    thead.innerHTML = `<tr><th>Предмет</th><th>Оценка</th><th>Примечание</th><th>Действия</th></tr>`;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    gradeData.forEach(grade => {
        const row = document.createElement('tr');

        const titleCell = document.createElement('td');
        titleCell.textContent = grade.subject;
        titleCell.classList.add('text-break');
        row.appendChild(titleCell);

        const gradeCell = document.createElement('td');
        gradeCell.textContent = grade.grade;
        row.appendChild(gradeCell);

        const noteCell = document.createElement('td');
        noteCell.textContent = grade.note;
        noteCell.classList.add('text-break');
        row.appendChild(noteCell);

        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.classList.add('btn', 'btn-primary');
        deleteButton.addEventListener('click', () => {
            const index = gradeData.indexOf(grade);
            if (index > -1) gradeData.splice(index, 1);
            renderGrades( gradeList); // Обновляем оценки
        });
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    gradeList.appendChild(table);
};

function addGrade(subject, grade, note, gradeList) {
    gradeData.push({ subject, grade, note });
    renderGrades( gradeList);
}

module.exports = { renderGrades, gradeData, addGrade };
