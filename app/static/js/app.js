/*global jQuery, Handlebars, Router, alert, window */

var username = null;
var token = null;

jQuery(function($) {
    'use strict';

    $.ajaxSetup({
        // xhrFields: { withCredentials: true },
        crossDomain: true,
        headers: {
            'X-Hasura-Role': 'user'
        }
    });

    var setUsername = function(u) {
        username = u;
        $('#userinfo').text(username);
    };

    function tokenHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        };
    }

    Handlebars.registerHelper('eq', function(a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    });

    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;

    var util = {
        uuid: function() {
            /*jshint bitwise:false */
            var i, random;
            var uuid = '';

            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid += '-';
                }
                uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
            }

            return uuid;
        },
        pluralize: function(count, word) {
            return count === 1 ? word : word + 's';
        },
        store: function(app) {
            var selectQuery = {
                "type": "select",
                "args": {
                    "table": "todo",
                    "columns": ["*"]
                }
            }
            $.ajax({
                url: window.dataUrl + '/v1/query',
                data: JSON.stringify(selectQuery),
                headers: tokenHeaders(),
                method: 'POST'
            }).done(function(data) {
                app.todos = data;
                app.render();
            });
        }
    };

    var App = {
        todos: [],
        init: function() {
            util.store(this);
            this.todoTemplate = Handlebars.compile($('#todo-template').html());
            this.footerTemplate = Handlebars.compile($('#footer-template').html());
            this.bindEvents();
            var _this = this;
            new Router({
                '/login': function() {
                    $.ajax({
                        url: window.authUrl + '/user/account/info',
                        headers: token ? tokenHeaders() : { 'Content-Type': 'application/json' },
                        method: 'GET'
                    }).done(function(data) {
                        window.location = '/#/all';
                        _this.userId = data.hasura_id;
                        token = data.auth_token;
                        setUsername(data.username);
                    }).fail(function() {
                        $('#login_submit').val('Login');
                        $('section.route-section').addClass('hidden');
                        $('#logout').addClass('hidden');
                        $('#login').removeClass('hidden');
                    });
                },
                '/register': function() {
                    $.ajax({
                        url: window.authUrl + '/user/account/info',
                        headers: token ? tokenHeaders() : { 'Content-Type': 'application/json' },
                        method: 'GET'
                    }).done(function(data) {
                        window.location = '/#/all';
                        _this.userId = data.hasura_id;
                        token = data.auth_token;
                        setUsername(data.username);
                    }).fail(function() {
                        $('#register_submit').val('Register');
                        $('section.route-section').addClass('hidden');
                        $('#logout').addClass('hidden');
                        $('#register').removeClass('hidden');
                    });
                },
                '/:filter': function(filter) {
                    $.ajax({
                        url: window.authUrl + '/user/account/info',
                        headers: token ? tokenHeaders() : { 'Content-Type': 'application/json' },
                        method: 'GET'
                    }).done(function(data) {
                        _this.filter = filter;
                        util.store(_this);
                        _this.userId = data.hasura_id;
                        token = data.auth_token;
                        setUsername(data.username);
                        $('section.route-section').addClass('hidden');
                        $('#logout').removeClass('hidden');
                        $('#todoapp').removeClass('hidden');
                    }).fail(function() {
                        window.location = '/#/login';
                    });
                }.bind(this)
            }).init('/all');
        },
        bindEvents: function() {
            $('#new-todo').on('keyup', this.create.bind(this));
            $('#toggle-all').on('change', this.toggleAll.bind(this));
            $('#footer').on('click', '#clear-completed', this.destroyCompleted.bind(this));
            $('#todo-list')
                .on('change', '.toggle', this.toggle.bind(this))
                .on('dblclick', 'label', this.edit.bind(this))
                .on('keyup', '.edit', this.editKeyup.bind(this))
                .on('focusout', '.edit', this.update.bind(this))
                .on('click', '.destroy', this.destroy.bind(this));
            $('#login_submit').on('click', this.login.bind(this));
            $('#register_submit').on('click', this.register.bind(this));
            $('#logout').on('click', this.logout.bind(this));
        },
        userId: 0,
        logout: function(e) {
            e.preventDefault();
            var _this = this;
            $.ajax({
                url: window.authUrl + '/user/logout',
                headers: tokenHeaders(),
                method: 'GET'
            }).done(function() {
                window.location = '/#/login';
                _this.userId = 0;
            }).fail(function(j) {
                console.error(j);
                alert('Logout failed! Try refreshing?');
            });
            return false;
        },
        login: function(e) {
            e.preventDefault();
            $('#login_submit').val('Logging in...');
            var loginUrl = window.authUrl + '/login';
            var data = { username: $('#username').val(), password: $('#password').val() };
            var _this = this;
            $.ajax({
                url: loginUrl,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(data)
            }).done(function(data) {
                _this.userId = data.hasura_id;
                token = data.auth_token;
                setUsername($('#username').val());
                window.location = '/#/all';
                $('#login_submit').val('Login');
            }).fail(function() {
                $('#login_submit').val('Failed. Try again?');
            });
            return false;
        },
        register: function(e) {
            e.preventDefault();
            $('#register_submit').val('Submitting...');
            var loginUrl = window.authUrl + '/signup';
            var pwd = $('#r_password').val();
            var pwd2 = $('#r_password2').val();
            if (pwd !== pwd2) {
                alert('Passwords don\'t match. Try again?');
                $('#register_submit').val('Register');
                return false;
            }
            var nameRegex = /^[a-zA-Z\-]+$/;
            var username = $('#r_username').val();
            if (nameRegex.exec(username) === null) {
                alert('Invalid username');
                $('#register_submit').val('Register');
                return false;
            }
            var email = null;
            var mobile = null;
            $.ajax({
                url: loginUrl,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ username: username, password: pwd, email: email, mobile: mobile })
            }).done(function(data) {
                token = data.auth_token;
                window.location = '/#/all';
                $('#register_submit').val('Redirecting...');
            }).fail(function(j) {
                console.error(j);
                alert("FAILED: " + JSON.parse(j.responseText).message);
                $('#register_submit').val('Failed. Try again?');
            });
            return false;
        },
        render: function() {
            var todos = this.getFilteredTodos();
            $('#todo-list').html(this.todoTemplate(todos));
            $('#main').toggle(todos.length > 0);
            $('#toggle-all').prop('checked', this.getActiveTodos().length === 0);
            this.renderFooter();
            $('#new-todo').focus();
        },
        renderFooter: function() {
            var todoCount = this.todos.length;
            var activeTodoCount = this.getActiveTodos().length;
            var template = this.footerTemplate({
                activeTodoCount: activeTodoCount,
                activeTodoWord: util.pluralize(activeTodoCount, 'item'),
                completedTodos: todoCount - activeTodoCount,
                filter: this.filter
            });

            $('#footer').toggle(todoCount > 0).html(template);
        },
        toggleAll: function(e) {
            var isChecked = $(e.target).prop('checked');

            var updateQuery = {

                "type": "update",
                "args": {
                    "table": "todo",
                    "$set": { completed: isChecked },
                    "where": {
                        user_id: this.userId
                    }
                }
            }

            var _this = this;
            $.ajax({
                url: window.dataUrl + '/v1/query',
                method: 'POST',
                data: JSON.stringify(updateQuery),
                headers: tokenHeaders()
            }).done(function() {
                _this.todos.forEach(function(todo) {
                    todo.completed = isChecked;
                });
                _this.render();
            }).fail(function() {
                alert('Try again? Failed to update.');
            });
        },
        getActiveTodos: function() {
            return this.todos.filter(function(todo) {
                return !todo.completed;
            });
        },
        getCompletedTodos: function() {
            return this.todos.filter(function(todo) {
                return todo.completed;
            });
        },
        getFilteredTodos: function() {
            if (this.filter === 'active') {
                return this.getActiveTodos();
            }

            if (this.filter === 'completed') {
                return this.getCompletedTodos();
            }

            return this.todos;
        },
        destroyCompleted: function() {
            var deleteQuery = {
                "type": "delete",
                "args": {
                    "table": "todo",
                    where: { completed: true }
                }
            };
            var _this = this;
            $.ajax({
                url: window.dataUrl + '/v1/query',
                method: 'POST',
                data: JSON.stringify(deleteQuery),
                headers: tokenHeaders()
            }).done(function() {
                _this.todos = _this.getActiveTodos();
                _this.filter = 'all';
                _this.render();
            }).fail(function() {
                alert('Try again? Failed to delete.');
            });
        },
        // accepts an element from inside the `.item` div and
        // returns the corresponding index in the `todos` array
        indexFromEl: function(el) {
            var id = $(el).closest('li').data('id');
            var todos = this.todos;
            var i = todos.length;

            while (i--) {
                if (todos[i].id === id) {
                    return i;
                }
            }
        },
        create: function(e) {
            var $input = $(e.target);
            var val = $input.val().trim();

            if (e.which !== ENTER_KEY || !val) {
                return;
            }

            var uid = util.uuid();
            var insertQuery = {
                "type": "insert",
                "args": {
                    "table": "todo",
                    "objects": [{
                        id: uid,
                        title: val,
                        completed: false,
                        user_id: this.userId
                    }],
                    "returning": ["id"]
                }
            }
            var _this = this;
            $.ajax({
                url: window.dataUrl + '/v1/query',
                method: 'POST',
                data: JSON.stringify(insertQuery),
                headers: tokenHeaders()
            }).done(function() {
                _this.todos.push({
                    id: uid,
                    title: val,
                    completed: false
                });
                $input.val('');
                _this.render();
            }).fail(function() {
                alert('Try again? Failed to update.');
            });
        },
        toggle: function(e) {
            var i = this.indexFromEl(e.target);
            var uid = this.todos[i].id;
            var oldCompleted = this.todos[i].completed;

            var updateQuery = {
                "type": "update",
                "args": {
                    "table": "todo",
                    "$set": { completed: !oldCompleted },
                    "where": {
                        id: uid
                    }
                }
            };
            var _this = this;
            $.ajax({
                url: window.dataUrl + '/v1/query',
                method: 'POST',
                data: JSON.stringify(updateQuery),
                headers: tokenHeaders()
            }).done(function() {
                _this.todos[i].completed = !_this.todos[i].completed;
                _this.render();
            }).fail(function() {
                alert('Try again? Failed to update.');
            });
        },
        edit: function(e) {
            var $input = $(e.target).closest('li').addClass('editing').find('.edit');
            $input.val($input.val()).focus();
        },
        editKeyup: function(e) {
            if (e.which === ENTER_KEY) {
                e.target.blur();
            }

            if (e.which === ESCAPE_KEY) {
                $(e.target).data('abort', true).blur();
            }
        },
        update: function(e) {
            var el = e.target;
            var $el = $(el);
            var val = $el.val().trim();

            if (!val) {
                this.destroy(e);
                return;
            }

            var _this = this;

            if ($el.data('abort')) {
                $el.data('abort', false);
            } else {
                var uid = this.todos[this.indexFromEl(el)].id;
                var updateQuery = {
                    "type": "update",
                    "args": {
                        "table": "todo",
                        $set: { title: val },
                        "where": {
                            id: uid
                        }
                    }
                };
                $.ajax({
                    url: window.dataUrl + '/v1/query',
                    method: 'POST',
                    data: JSON.stringify(updateQuery),
                    headers: tokenHeaders()
                }).done(function() {
                    _this.todos[_this.indexFromEl(el)].title = val;
                    _this.render();
                }).fail(function() {
                    alert('Try again? Failed to update.');
                });
            }
        },
        destroy: function(e) {
            var uid = this.todos[this.indexFromEl(e.target)].id;
            var deleteQuery = {
                "type": "delete",
                "args": {
                    "table": "todo",
                    where: { id: uid }
                }
            };
            var _this = this;
            $.ajax({
                url: window.dataUrl + '/v1/query',
                method: 'POST',
                data: JSON.stringify(deleteQuery),
                headers: tokenHeaders()
            }).done(function() {
                _this.todos.splice(_this.indexFromEl(e.target), 1);
                _this.render();
            }).fail(function() {
                alert('Try again? Failed to delete.');
            });
        }
    };

    App.init();
});
