define(['managerAPI',
		'https://cdn.jsdelivr.net/gh/minnojs/minno-datapipe@1.*/datapipe.min.js'], function(Manager){

	const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
	const respondentId = urlParams.get('uid') || 'NO_ID'; 

	var API    = new Manager();
	
	API.addGlobal({
        respondentId: respondentId
    });

	// init_data_pipe(API, 'gwZKTRm7QDHI',  {file_type:'csv'});	

    API.setName('mgr');
    API.addSettings('skip',true);

    let raceSet = API.shuffle(['a','b'])[0];
    let blackLabels = [];
    let whiteLabels = [];

    if (raceSet == 'a') {
        blackLabels.push('башкирам');
        whiteLabels.push('русским');
    } else {
        blackLabels.push('башкирам');
        whiteLabels.push('русским');
    }

    API.addGlobal({
        raceiat:{},
        baseURL: './images/',
        raceSet:raceSet,
        blackLabels:blackLabels,
        whiteLabels:whiteLabels,
        // Случайный выбор слов для атрибутов (Axt, Feng, & Bar-Anan, 2021)
        baWords : API.shuffle([
            'Сабантуй', 'Бешбармак', 'Урал-Батыр',
            'Агидель', 'Бешмет', 'Курай', 'Юрта', 'Кумыс', 'Тюбитейка'
        ]),
        ruWords : API.shuffle([
            'Масленица', 'Пельмени', 'Илья Муромец', 
            'Волга', 'Кокошник', 'Балалайка', 'Изба', 'Квас', 'Шапка-ушанка'
        ])
    });
// --- НАЧАЛО БЛОКА ОТПРАВКИ В ЯНДЕКС ---

    const YANDEX_FUNCTION_URL = "https://functions.yandexcloud.net/d4ekhluuh9cjf4on17pa";
    function logsToCSV(logs) {
        if (!logs || !logs.length) return "";
        var headers = new Set();
        var flattenedLogs = logs.map(function(log) {
            var flat = {};
            flat.type = log.type;
            flat.name = log.name;
            flat.latency = log.latency;
            flat.timestamp = log.timestamp;
            
            if (log.data && typeof log.data === 'object') {
                for (var key in log.data) {
                    flat[key] = log.data[key];
                }
            }
            Object.keys(flat).forEach(function(k) { headers.add(k); });
            return flat;
        });

        var headersArr = Array.from(headers);
        var csv = headersArr.join(",") + "\n"; // Заголовки

        csv += flattenedLogs.map(function(row) {
            return headersArr.map(function(header) {
                var val = row[header];
                if (val === null || val === undefined) return "";
                var str = String(val);
                if (str.includes(",") || str.includes("\"") || str.includes("\n")) {
                    return '"' + str.replace(/"/g, '""') + '"';
                }
                return str;
            }).join(",");
        }).join("\n");

        return csv;
    }

    function sendToYandex(input, context) {
        // Получаем все логи текущей сессии
        var allLogs = window.minnoJS.logger.getLogs(); 
        var csvData = logsToCSV(allLogs);
        
        var globalData = API.getGlobal();
        var respondentId = globalData.respondentId || 'unknown';
        var fileName = 'iat_data_' + respondentId + '.csv';

        return fetch(YANDEX_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileName: fileName,
                fileData: csvData
            })
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function(data) {
            console.log('Data saved successfully:', data);
        })
        .catch(function(error) {
            console.error('Error saving data:', error);
        });
    }
    API.addTasksSet({
        instructions: [{
            type: 'message',
            buttonText: 'Continue'
        }],

        intro: [{
            inherit: 'instructions',
            name: 'intro',
            templateUrl: 'intro.jst',
            title: 'Intro',
            header: 'Welcome'
        }],

        raceiat_instructions: [{
            inherit: 'instructions',
            name: 'raceiat_instructions',
            templateUrl: 'raceiat_instructions.jst',
            title: 'IAT Instructions',
            header: 'Implicit Association Test'
        }],

        explicits: [{
            type: 'quest',
            name: 'explicits',
            scriptUrl: 'explicits.js'
        }],

		feedback: [{
            type: 'quest',
            name: 'feedback',
            scriptUrl: 'feedback.js'
		}],

        raceiat: [{
            type: 'time',
            name: 'raceiat',
            scriptUrl: 'raceiat.js'
        }],

        lastpage: [{
            type: 'message',
            name: 'lastpage',
            templateUrl: 'lastpage.jst',
            title: 'End',
            header: 'You have completed the study'
        }], 
        
       redirect_success: [{ 
            type: 'redirect', 
            name: 'redirecting_success', 
            url: 'https://anketolog.ru/rs/993764/kI8Z0LUH' + respondentId 
        }],
		
        uploading: uploading_task({header: 'just a moment', body:'Please wait, sending data... '})
    });

    // 3. ПОСЛЕДОВАТЕЛЬНОСТЬ ЗАДАНИЙ
    API.addSequence([
        { type: 'isTouch' }, // Определение тач-устройства
        
        { type: 'post', path: ['$isTouch', 'raceSet', 'blackLabels', 'whiteLabels' 'respondentId'] },

        {
            mixer:'branch',
            conditions: {compare:'global.$isTouch', to: true},
            data: [
                {
                    type: 'injectStyle',
                    css: [
                        '* {color:black}',
                        '[piq-page] {background-color: #fff; border: 1px solid transparent; border-radius: 4px; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); margin-bottom: 20px; border-color: #bce8f1;}',
                        '[piq-page] > ol {margin: 15px;}',
                        '[piq-page] > .btn-group {margin: 0px 15px 15px 15px;}',
                        '.container {padding:5px;}',
                        '[pi-quest]::before, [pi-quest]::after {content: " ";display: table;}',
                        '[pi-quest]::after {clear: both;}',
                        '[pi-quest] h3 { border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px; padding: 10px 15px; color: inherit; font-size: 2em; margin-bottom: 20px; margin-top: 0;background-color: #d9edf7;border-color: #bce8f1;color: #31708f;}',
                        '[pi-quest] .form-group > label {font-size:1.2em; font-weight:normal;}',

                        '[pi-quest] .btn-toolbar {margin:15px;float:none !important; text-align:center;position:relative;}',
                        '[pi-quest] [ng-click="decline($event)"] {position:absolute;right:0;bottom:0}',
                        '[pi-quest] [ng-click="submit()"] {width:30%;line-height: 1.3333333;border-radius: 6px;}',
                        // larger screens
                        '@media (min-width: 480px) {',
                        ' [pi-quest] [ng-click="submit()"] {width:30%;padding: 10px 16px;font-size: 1.6em;}',
                        '}',
                        // phones and smaller screens
                        '@media (max-width: 480px) {',
                        ' [pi-quest] [ng-click="submit()"] {padding: 8px 13px;font-size: 1.2em;}',
                        ' [pi-quest] [ng-click="decline($event)"] {font-size: 0.9em;padding:3px 6px;}',
                        '}'
                    ]
                }
            ]
        },
        
        {inherit: 'intro'},
        {
            mixer:'random',
            data:[
                {inherit: 'explicits'},

                {
                    mixer: 'wrapper',
                    data: [
                        {inherit: 'raceiat_instructions'},
                        {inherit: 'raceiat'}
                    ]
                }
            ]
        },

		{inherit: 'feedback'},
		{inherit: 'uploading'}, 
        {inherit: 'lastpage'},  
        
        {inherit: 'redirect_success'}
	]);

    return API.script;
});
