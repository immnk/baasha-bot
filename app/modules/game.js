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
    }, {
        question: 'Fill it: Despicable __',
        options: [{
            "content_type": "text",
            title: 'Me',
            payload: 'GAME_RIGHT'
        }, {
            "content_type": "text",
            title: 'You',
            payload: 'GAME_WRONG'
        }, {
            "content_type": "text",
            title: 'Someone',
            payload: 'GAME_WRONG'
        }]
    }, {
        question: 'Which leading actor got highest number of filmfare awards?',
        options: [{
            "content_type": "text",
            title: 'Dhanush',
            payload: 'GAME_WRONG'
        }, {
            "content_type": "text",
            title: 'Kamal Hassan',
            payload: 'GAME_RIGHT'
        }, {
            "content_type": "text",
            title: 'MGR',
            payload: 'GAME_WRONG'
        }]
    }, {
        question: 'Fill it: Fast and __',
        options: [{
            "content_type": "text",
            title: 'Furious',
            payload: 'GAME_RIGHT'
        }, {
            "content_type": "text",
            title: 'Stop',
            payload: 'GAME_WRONG'
        }, {
            "content_type": "text",
            title: 'Wonder',
            payload: 'GAME_WRONG'
        }]
    }, {
        question: 'When did the first color film got released?',
        options: [{
            "content_type": "text",
            title: '1967',
            payload: 'GAME_WRONG'
        }, {
            "content_type": "text",
            title: '1933',
            payload: 'GAME_RIGHT'
        }, {
            "content_type": "text",
            title: '1990',
            payload: 'GAME_WRONG'
        }]
    }, {
        question: 'Fill me: magalir __',
        options: [{
            "content_type": "text",
            title: 'shakthi',
            payload: 'GAME_WRONG'
        }, {
            "content_type": "text",
            title: 'sangam',
            payload: 'GAME_WRONG'
        }, {
            "content_type": "text",
            title: 'mattum',
            payload: 'GAME_RIGHT'
        }]
    }, {
        question: 'I dont know who you are but I find you and kill you. ??',
        options: [{
            "content_type": "text",
            title: 'Kung Fu panda',
            payload: 'GAME_WRONG'
        }, {
            "content_type": "text",
            title: 'The lord of the rings',
            payload: 'GAME_WRONG'
        }, {
            "content_type": "text",
            title: 'Taken',
            payload: 'GAME_RIGHT'
        }]
    }],
    getRandomGame: function() {
        var min = 0,
            max = this.questions.length - 1;
        var random = Math.floor(Math.random() * (max - min)) + min;
        return this.questions[random];
    }
}