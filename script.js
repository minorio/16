//Baiduk Marina

//16

// "Создать форму - 2 инпута даты и кнопка ""Рассчитать"". 
// При нажатии на кнопку получить курс доллара с сайта нацбанка на все даты в диапазоне и вывести на интерфейс дату с минимальным и максимальным курсами(с указанием курса).
//  Кнопку можно нажать только есть обе даты введены и диапазон корректен (то есть левая дата меньше правой).
//  Одним запросом можно получать курс только на один день(нельзя использовать эндпоинт на получение курсов на диапазон дат)
// ДЗ разместить на GIT скинуть ссылку на репозиторий"



const dateStart = document.querySelector('#date-start');
const dateEnd = document.querySelector('#date-end');
const formBtn = document.querySelector('.btn');
const infoBox = document.querySelector('.info-box');


dateStart.addEventListener('input', (event) => {
    if (dateStart.value > dateStart.getAttribute('max')) {
        dateStart.value = dateStart.getAttribute('max')
    }
});
dateStart.addEventListener('blur', (event) => {
    if (dateStart.value < dateStart.getAttribute('min')) {
        dateStart.value = dateStart.getAttribute('min')
    }
});

dateEnd.addEventListener('input', isEndDateValid);
dateEnd.addEventListener('blur', (event) => {
    if (dateEnd.value < dateEnd.getAttribute('min')) {
        dateEnd.value = dateEnd.getAttribute('min')
    }
    if (dateStart.value > dateEnd.value) {
        dateStart.value = dateEnd.value;
    }
});

function isEndDateValid() {
    dateStart.setAttribute('max', dateEnd.value)
    if (dateEnd.value > dateEnd.getAttribute('max')) {
        dateEnd.value = dateEnd.getAttribute('max')
    }
}


const today = new Date().toISOString().slice(0, 10);

dateStart.value = today;
dateEnd.value = today;
dateEnd.setAttribute('max', today)


isEndDateValid()


formBtn.addEventListener('click', (event) => {
    event.preventDefault()

    const valueDateStart = Date.parse(dateStart.value);
    const valueDateEnd = Date.parse(dateEnd.value);
    const datesArray = [];


    for (let i = valueDateStart; i <= valueDateEnd; i = i + 24 * 60 * 60 * 1000) {
        datesArray.push(new Date(i).toISOString().slice(0, 10))
    }


    (async function () {

        infoBox.innerText = '';
        const result = [];

        await Promise.all(datesArray.map(date => fetch(`https://www.nbrb.by/api/exrates/rates/usd?parammode=2&ondate=${date}`)))
            .then(responses => Promise.all(responses.map(r => r.json())))
            .then(currencies => {
                currencies.forEach(currency => result.push({ [currency.Date.slice(0, 10)]: currency.Cur_OfficialRate }))

                result.sort((a, b) => Object.values(a) - Object.values(b));

                if (result.length !== 0) {

                    infoBox.classList.remove('hide')

                    for (let i = 0; i < result.length; i += result.length - 1) {
                        const p = document.createElement('p');
                        const str = `${Object.keys(result[i])} ---------- ${Object.values(result[i])}`;

                        if (result.length === 1) {
                            i++;
                            p.innerText = `Курс на этот день: ${str}`;
                        } else if (i === 0) {
                            p.innerText = `Минимальный курс: ${str}`;
                        } else if (i === result.length - 1) {
                            p.innerText = `Максимальный курс: ${str}`;
                        }

                        infoBox.append(p)
                    }
                }

            })
    })()
})






