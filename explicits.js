define(['questAPI'], function(Quest){
    let API = new Quest();
    let isTouch = API.getGlobal().$isTouch;
	
    /**
	* Page prototype
	*/
    API.addPagesSet('basicPage',{
        noSubmit:false, // показываем кнопку "Далее"
        header: 'Вопросник',
        decline: false,
        declineText: isTouch ? 'Decline' : 'Отказ от ответа', 
        autoFocus:true, 
        progressBar:  'Страница <%= pagesMeta.number %> из 8',
		submitText: 'Далее'
    });
	
    /**
	* Question prototypes
	*/
    API.addQuestionsSet('basicQ',{
        decline: 'false',
        required : true, 		
        errorMsg: {
            required: isTouch 
                ? 'Выберите подходящий вариант ответа, или нажмите \'Decline\''
                : 'Выберите подходящий вариант ответа, или нажмите \'Отказ от ответа\''
        },
        autoSubmit:'true',
        numericValues:'true',
        help: '<%= pagesMeta.number < 3 %>',
        helpText: 'Для быстрого ответа нажмите на подходящий вариант дважды.'
    });

    API.addQuestionsSet('basicSelect',{
        inherit :'basicQ',
        type: 'selectOne'
    });
	
    API.addQuestionsSet('basicDropdown',{
        inherit :'basicQ',
        type : 'dropdown',
        autoSubmit:false
    });

    // Базовый прототип для открытых вопросов
    API.addQuestionsSet('basicOpen',{
        inherit: 'basicQ',
        type: 'text',
        autoSubmit:false,
        numericValues:false
    });

    // Базовый прототип для мультивыбора
    API.addQuestionsSet('basicMulti',{
        inherit: 'basicQ',
        type: 'selectMulti',
        autoSubmit:false
    });

    /************* КОНКРЕТНЫЕ ВОПРОСЫ *************/

    // 1. Открытый вопрос про самоидентификацию
    API.addQuestionsSet('natChoiceOpen',{
        inherit : 'basicOpen',
        name: 'nat_primary_choice',
        stem: 'Если бы завтра проводилась перепись населения и можно было выбрать только одну национальность, какую бы вы указали?'
    });

    // 2. Оценка одиночества / потерянности после первого отъезда из дома
    API.addQuestionsSet('lonelinessMove',{
        inherit : 'basicSelect',
        name: 'loneliness_first_move',
        stem: 'Оцените, насколько сильно Вы испытывали чувство одиночества и потерянности в первое время после того, как впервые уехали из родного дома:',
        answers: [
            {text:'0. Не уезжал(а) из родного дома', value:0},
            {text:'1. Совсем не испытывал(а)', value:1},
            {text:'2. Испытывал(а) слабо', value:2},
            {text:'3. Испытывал(а) умеренно', value:3},
            {text:'4. Испытывал(а) сильно', value:4},
            {text:'5. Испытывал(а) очень сильно', value:5}
        ]
    });

    // 3. Значимый другой той же национальности
    API.addQuestionsSet('sigOtherSameNat',{
        inherit : 'basicSelect',
        name: 'sig_other_same_nat',
        stem: 'Был ли в Вашей жизни человек или люди Вашей национальности, взаимодействие с которым(и) заставило Вас сильнее ощутить свою собственную национальную принадлежность?',
        answers: [
            {text:'1. Да, был(и)', value:1},
            {text:'2. Нет, не было', value:2}
        ]
    });

    // 4. Негативный опыт на основе национальности
    API.addQuestionsSet('badTreatmentNat',{
        inherit : 'basicSelect',
        name: 'bad_treatment_nat',
        stem: 'Сталкивались ли Вы с плохим отношением к Вам, связанным с Вашей национальностью?',
        answers: [
            {text:'1. Да, было такое', value:1},
            {text:'2. Нет, не было', value:2}
        ]
    });

    // 5. Работа, связанная с национальностью
    API.addQuestionsSet('workNat',{
        inherit : 'basicSelect',
        name: 'work_nat_related',
        stem: 'Связана ли Ваша профессиональная деятельность или работа с Вашей национальностью?',
        answers: [
            {text:'1. Да, связана', value:1},
            {text:'2. Нет, не связана', value:2}
        ]
    });

    // 6. События, усилившие ощущение национальной принадлежности
    API.addQuestionsSet('eventsNat',{
        inherit : 'basicSelect',
        name: 'events_nat_awareness',
        stem: 'Были ли в Вашей жизни события, которые заставили Вас сильнее осознать свою национальную принадлежность?',
        answers: [
            {text:'1. Да, было такое', value:1},
            {text:'2. Нет, не было', value:2}
        ]
    });

    // 7. Ситуации общения на национальном языке (мультивыбор)
    API.addQuestionsSet('languageContexts',{
        inherit : 'basicMulti',
        name: 'nat_language_child',
        stem: 'Выберите все ситуации, в которых Вы общались на национальном языке в детские и подростковые годы:',
        answers: [
            {text:'0. Не общался(ась) на национальном языке', value:0},
            {text:'1. С родителями', value:1},
            {text:'2. С бабушками и дедушками', value:2},
            {text:'3. С другими родственниками, со сверстниками', value:3},
            {text:'4. В общественных местах (школа, больницы, кружки и пр.)', value:4},
            {text:'5. Другое (укажу ниже)', value:5}
        ]
    });

    API.addQuestionsSet('languageContextsOther',{
        inherit : 'basicOpen',
        name: 'nat_language_child_other',
        stem: 'Если Вы выбрали вариант «Другое» в предыдущем вопросе, опишите, пожалуйста, в каких ещё ситуациях Вы общались на национальном языке (если нет — оставьте поле пустым).',
        required: false
    });

    // 8. Национальные мероприятия за последние 12 месяцев (мультивыбор)
    API.addQuestionsSet('natActivities12m',{
        inherit : 'basicMulti',
        name: 'nat_activities_12m',
        stem: 'Укажите, в каких национальных мероприятиях или активностях Вы принимали участие в течение последних 12 месяцев (можно выбрать несколько вариантов):',
        answers: [
            {text:'0. Не принимал(а) участие', value:0},
            {text:'1. Традиционные праздники и фестивали (например, Сабантуй, Нардуган, Каргатуй)', value:1},
            {text:'2. Концерты, спектакли и театральные постановки на национальном языке', value:2},
            {text:'3. Современные городские и молодежные мероприятия (например, самоварные танцы, гитарные концерты возле памятника Салавату)', value:3},
            {text:'4. Встречи землячеств, национально-культурных организаций', value:4},
            {text:'5. Обучающие и просветительские мероприятия (курсы языка, лекции по истории и культуре, мастер-классы)', value:5},
            {text:'6. Спортивные мероприятия и состязания', value:6},
            {text:'7. Другое (укажу ниже)', value:7}
        ]
    });

    API.addQuestionsSet('natActivities12mOther',{
        inherit : 'basicOpen',
        name: 'nat_activities_12m_other',
        stem: 'Если Вы выбрали вариант «Другое» в предыдущем вопросе, опишите, пожалуйста, какие это были мероприятия (если нет — оставьте поле пустым).',
        required: false
    });

    /************* ПОСЛЕДОВАТЕЛЬНОСТЬ СТРАНИЦ *************/

    API.addSequence([
        { // 1. Открытый вопрос про самоидентификацию
            inherit:'basicPage',
            questions: {inherit:'natChoiceOpen'}
        },
        { // 2. Оценка одиночества при отъезде
            inherit:'basicPage',
            questions: {inherit:'lonelinessMove'}
        },
        { // 3. Значимый другой той же национальности
            inherit:'basicPage',
            questions: {inherit:'sigOtherSameNat'}
        },
        { // 4. Негативное отношение из-за национальности
            inherit:'basicPage',
            questions: {inherit:'badTreatmentNat'}
        },
        { // 5. Работа, связанная с национальностью
            inherit:'basicPage',
            questions: {inherit:'workNat'}
        },
        { // 6. События, усилившие ощущение национальной принадлежности
            inherit:'basicPage',
            questions: {inherit:'eventsNat'}
        },
        { // 7. Языковые практики в детстве/подростковом возрасте
            inherit:'basicPage',
            questions: [
                {inherit:'languageContexts'},
                {inherit:'languageContextsOther'}
            ]
        },
        { // 8. Национальные мероприятия за последние 12 месяцев
            inherit:'basicPage',
            questions: [
                {inherit:'natActivities12m'},
                {inherit:'natActivities12mOther'}
            ]
        }
    ]);

    return API.script;
});
