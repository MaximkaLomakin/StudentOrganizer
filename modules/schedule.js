let scheduleData = {
    1: { // Первая неделя
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
    },
    2: { // Вторая неделя
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
    },
};

function addSchedule(subject, day, order, week, notes, scheduleMap) {
    if (scheduleData[week][day]) {
        scheduleData[week][day].push({ subject, notes, order });
        console.log(scheduleData);
        scheduleData[week][day].sort((a, b) => a.order - b.order); // Сортируем занятия по порядку
        renderSchedule(scheduleMap);
    }

}


function renderSchedule(scheduleMap) {
    [1, 2].forEach(week => { // Перебор обеих недель
        Object.keys(scheduleMap[week]).forEach(day => {
            const container = scheduleMap[week][day];
            if (!scheduleData[week][day].length) {
                container.innerHTML = '<div class="fw-bold">Расписание не задано.</div>';
                return;
            }
            container.innerHTML = ''; // Очищаем контейнер
            scheduleData[week][day].forEach(item => {
                const block = document.createElement('div');
                block.className = 'schedule-item';
                block.classList.add('d-flex', 'justify-content-between', 'text-break');
                block.textContent = `${item.order}. ${item.subject} ${item.notes ? `- ${item.notes}` : ``}`
                block.setAttribute('data-order', item.order);

                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '<i class="bi bi-trash"/>';
                deleteButton.classList.add('btn', 'btn-outline-danger', 'btn-sm');
                deleteButton.addEventListener('click', () => {
                    scheduleData[week][day] = scheduleData[week][day].filter(i => i !== item);
                    renderSchedule(scheduleMap); // Обновляем расписание
                });
                block.appendChild(deleteButton);

                container.appendChild(block);
            });
        });
    });
};

module.exports = { scheduleData, addSchedule, renderSchedule }