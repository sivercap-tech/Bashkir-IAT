define(['questAPI'], function(Quest){
    let API = new Quest();
    let isTouch = API.getGlobal().$isTouch;

    /**
     * Шаблон страницы
     */
    API.addPagesSet('basicPage',{
        noSubmit:false,
        header: 'Обратная связь',
        decline: false,
        declineText: isTouch ? 'Decline' : 'Отказ от ответа',
        autoFocus:true,
        progressBar: 'По желанию можете оставить обратную связь, которой мы будем очень благодарны!'
    });

    /**
     * Базовый шаблон открытого вопроса
     */
    API.addQuestionsSet('openQ',{
        type: 'text',
        decline: 'false',
        required : false, // открытые вопросы, можно пропустить
        autoSubmit:false,
        numericValues:false,
        rows: 4,
        errorMsg: {
            required: isTouch 
                ? 'Пожалуйста, введите ответ или нажмите "Decline".'
                : 'Пожалуйста, введите ответ или нажмите «Отказ от ответа».'
        },
        help: false,
        helpText: ''
    });

    /************* КОНКРЕТНЫЕ ВОПРОСЫ *************/

    // 1. Общие впечатления
    API.addQuestionsSet('fb_general',{
        inherit: 'openQ',
        name: 'fb_general',
        stem: 'Пожалуйста, опишите своими словами, какие у Вас остались общие впечатления от прохождения этого теста'
    });

    // 2. Сложность / дискомфорт
    API.addQuestionsSet('fb_difficulty',{
        inherit: 'openQ',
        name: 'fb_difficulty',
        stem: 'Были ли в тесте моменты, которые показались Вам особенно сложными, непонятными или неприятными? Если да, опишите, пожалуйста'
    });

    // 3. Комментарии и пожелания
    API.addQuestionsSet('fb_comments',{
        inherit: 'openQ',
        name: 'fb_comments',
        stem: 'Было ли у Вас ощущение, что какие-то категории проще / сложнее соотносить друг с другом на интуитивном уровне?'
    });

    /************* ПОСЛЕДОВАТЕЛЬНОСТЬ СТРАНИЦ *************/

    API.addSequence([
        {
            inherit: 'basicPage',
            questions: [
                {inherit:'fb_general'},
                {inherit:'fb_difficulty'},
                {inherit:'fb_comments'}
            ]
        }
    ]);

    return API.script;
});
