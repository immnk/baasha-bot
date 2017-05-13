module.exports = {
    questions: [{
        question: 'Do you have any medical conditions?',
        options: [{
            "content_type": "text",
            title: 'Diabetes',
            payload: 'GAME_WRONG'
        }, {
            "content_type": "text",
            title: 'BP',
            payload: 'GAME_RIGHT'
        }, {
            "content_type": "text",
            title: 'Cancer',
            payload: 'GAME_WRONG'
        }]
    }, {
        question: 'Are you on any specific diet?',
        options: [{
            "content_type": "text",
            title: 'Low fat',
            payload: 'GAME_RIGHT'
        }, {
            "content_type": "text",
            title: 'No spice',
            payload: 'GAME_WRONG'
        }, {
            "content_type": "text",
            title: 'Vegen Diet',
            payload: 'GAME_WRONG'
        },
        {
            "content_type": "text",
            title: 'Vegeterian',
            payload: 'GAME_WRONG'

        ]
    }, {
        question: 'What are you allergic to?',
        options: [{
            "content_type": "text",
            title: 'Milk',
            payload: 'GAME_WRONG'
        }, {
            "content_type": "text",
            title: 'Cheese',
            payload: 'GAME_RIGHT'
        }, {
            "content_type": "text",
            title: 'Butter',
            payload: 'GAME_WRONG'
        }]
    }, ],
    getRandomGame: function() {
        var min = 0,
            max = this.questions.length - 1;
        var random = Math.floor(Math.random() * (max - min)) + min;
        return this.questions[random];
    }
}