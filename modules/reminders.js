let reminderData = [];
function addReminder(reminder, deadline, reminderList) {
    reminderData.push({ reminder, deadline });
    renderReminders(reminderList);
}

function renderReminders(reminderList) {
    if (!reminderData.length) {
        reminderList.innerHTML = '<div class="text-center fw-bold">Напоминания отсутствуют.</div>';
        return;
    }
    reminderList.innerHTML = '';
    reminderData.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)); // Сортируем по дате

    const table = document.createElement('table');
    table.className = 'table table-hover';
    const thead = document.createElement('thead');
    thead.innerHTML = `<tr><th>Напоминание</th><th>Дедлайн</th><th>Действия</th></tr>`;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    reminderData.forEach(reminder => {
        const row = document.createElement('tr');

        const titleCell = document.createElement('td');
        titleCell.classList.add('text-break');
        titleCell.textContent = reminder.reminder;
        row.appendChild(titleCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = reminder.deadline;
        row.appendChild(dateCell);

        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.classList.add('btn', 'btn-primary');
        deleteButton.addEventListener('click', () => {
            const index = reminderData.indexOf(reminder);
            if (index > -1) reminderData.splice(index, 1);
            renderReminders(reminderList); // Обновляем напоминания
        });
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    reminderList.appendChild(table);
};
module.exports = { renderReminders, reminderData, addReminder };
