module.exports = {
    questions: [{
        question: 'What is prabhas latest movie?',
        options: [{
            "content_type": "text",
            title: 'Mirchi',
            payload: 'GAME_WRONG'
        }, {
            "content_type": "text",
            title: 'Baahubali',
            payload: 'GAME_RIGHT'
        }, {
            "content_type": "text",
            title: 'Rebel',
            payload: 'GAME_WRONG'
        }]
    }, {
        question: 'Who said: Naa oru dhadava sonnu 100 sonna madhiri?',
        options: [{
            "content_type": "text",
            title: 'Rajinikanth',
            payload: 'GAME_RIGHT'
        }, {
            "content_type": "text",
            title: 'Amitabh Bachan',
            payload: 'GAME_WRONG'
        }, {
            "content_type": "text",
            title: 'Kamal Hassan',
            payload: 'GAME_WRONG'
        }]
    }, {
        question: 'Which actress got most filmfare awards?',
        options: [{
            "content_type": "text",
            title: 'Vidya balan',
            payload: 'GAME_WRONG'
        }, {
            "content_type": "text",
            title: 'Kajol',
            payload: 'GAME_RIGHT'
        }, {
            "content_type": "text",
            title: 'Sridevi',
            payload: 'GAME_WRONG'
        }]
    }],
    getRandomGame: function() {
        var min = 0,
            max = this.questions.length - 1;
        var random = Math.floor(Math.random() * (max - min)) + min;
        return this.questions[random];
    }
}