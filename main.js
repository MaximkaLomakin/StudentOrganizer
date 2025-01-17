document.addEventListener('DOMContentLoaded', function () {
    const scheduleList = document.getElementById('schedule-list');
    const scheduleData = {
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
    const scheduleMap = {
        1: {
            monday: document.getElementById('schedule-monday-week1'),
            tuesday: document.getElementById('schedule-tuesday-week1'),
            wednesday: document.getElementById('schedule-wednesday-week1'),
            thursday: document.getElementById('schedule-thursday-week1'),
            friday: document.getElementById('schedule-friday-week1'),
            saturday: document.getElementById('schedule-saturday-week1'),
        },
        2: {
            monday: document.getElementById('schedule-monday-week2'),
            tuesday: document.getElementById('schedule-tuesday-week2'),
            wednesday: document.getElementById('schedule-wednesday-week2'),
            thursday: document.getElementById('schedule-thursday-week2'),
            friday: document.getElementById('schedule-friday-week2'),
            saturday: document.getElementById('schedule-saturday-week2'),
        },
    };


    document.getElementById('add-schedule').addEventListener('click', () => {
        createModalDialog('Добавить занятие', [
            { label: 'Название занятия', name: 'subject', required: true },
            {
                label: 'День недели', name: 'day', type: 'select', required: true, options: [
                    { value: 'monday', label: 'Понедельник' },
                    { value: 'tuesday', label: 'Вторник' },
                    { value: 'wednesday', label: 'Среда' },
                    { value: 'thursday', label: 'Четверг' },
                    { value: 'friday', label: 'Пятница' },
                    { value: 'saturday', label: 'Суббота' },
                ]
            },
            { label: 'Порядок занятия (например, номер пары)', name: 'order', required: true, type: 'number' },
            {
                label: 'Номер недели', name: 'week', required: true, type: 'select', options: [
                    { value: '1', label: 'Первая неделя' },
                    { value: '2', label: 'Вторая неделя' },
                ]
            },
            { label: 'Примечание', name: 'notes', required: false, type: 'text' }
        ], ({ subject, day, order, week, notes}) => {
            if (scheduleData[week][day]) {
                scheduleData[week][day].push({ subject, notes, order });
                scheduleData[week][day].sort((a, b) => a.order - b.order); // Сортируем занятия по порядку
                renderSchedule();
            }
        });
    });

    function createModalDialog(title, fields, onSubmit) {
        const modal = document.getElementById('modalka');
        const modalBS = bootstrap.Modal.getInstance(modal)
        const block = modal.querySelector(".modal-content")
        block.innerHTML = `
                        <div class="modal-header">
                            <h1 class="modal-title fs-5">${title}</h1>
                            <button type="button" class="btn-close cancel" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form>
                            <div class="modal-body">
                                 ${fields.map(field => field.type === 'select' ? `
                                    <div class="mb-3">
                                        <label class="col-form-label">${field.label}</label>
                                        <select name="${field.name}" class="form-select" aria-label="Выберите неделю">
                                            ${field.options.map(option =>
            `<option value="${option.value}">${option.label}</option>
                                            `).join('')}
                                        </select>
                                    </div>
                            `: `
                                    <div class="mb-3">
                                        <label class="col-form-label">${field.label}</label>
                                        <input type="${field.type || 'text'}" name="${field.name}" class="form-control" ${field.required ? 'required' : ''}>
                                    </div>
                                  `).join('')}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary cancel" data-bs-dismiss="modal">Отмена</button>
                                <button type="submit" class="btn btn-primary">Добавить</button>
                            </div>
                        </form>
        `;

        document.body.appendChild(modal);

        const form = modal.querySelector('form');

        form.addEventListener('submit', (e) => {
            modalBS.hide();
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            onSubmit(data);
        });
    };

    const renderSchedule = () => {
        console.log(scheduleData);
        console.log(scheduleList);
        console.log(scheduleMap);
        [1, 2].forEach(week => { // Перебор обеих недель
            Object.keys(scheduleMap[week]).forEach(day => {
                const container = scheduleMap[week][day];
                container.innerHTML = ''; // Очищаем контейнер
                scheduleData[week][day].forEach(item => {
                    const block = document.createElement('div');
                    block.className = 'schedule-item';
                    block.classList.add('d-flex', 'justify-content-between');
                    block.textContent = `${item.order}. ${item.subject} ${item.notes ? `- ${item.notes}` :``}`
                    block.setAttribute('data-order', item.order);

                    const deleteButton = document.createElement('button');
                    deleteButton.innerHTML = '<i class="bi bi-trash"/>';
                    deleteButton.classList.add('btn', 'btn-outline-danger', 'btn-sm');
                    deleteButton.addEventListener('click', () => {
                        scheduleData[week][day] = scheduleData[week][day].filter(i => i !== item);
                        renderSchedule(); // Обновляем расписание
                    });
                    block.appendChild(deleteButton);

                    container.appendChild(block);
                });
            });
        });
    };
});