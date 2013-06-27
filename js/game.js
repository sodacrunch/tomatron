// Haroon Khalid
// Tomatron
// mobile browser test

var ongoingTouches = new Array;

// Global
var level = 1;
var level_one_create = true;

// Music
var stage_0_sound_ready = false;
var stage_0_sound = document.createElement('audio');
stage_0_sound.oncanplay = function () {
    console.log("music loaded");
}

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
//document.* doesnt work
win_width = window.innerWidth;
win_height = window.innerHeight;
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
document.body.appendChild(canvas);

// Animation
function animation_draw() {
    var now = (new Date()).getTime();
    if (!this.last_time) this.last_time = now;

    this.time_remaining -= now - this.last_time;
    this.last_time = now;

    while (this.time_remaining <= 0) {
        this.current_item++;
        this.current_item %= this.sequence.length;
        if (this.current_item == 0) this.cycle_callback();
        this.time_remaining += this.sequence[this.current_item].duration;
    }

    if (this.current_item === false) return;

    ctx.drawImage(this.sequence[this.current_item].item, this.position[0], this.position[1]);
}

function animation(sequence, position, loading_callback,
    cycle_callback, duration) {
    if (typeof (sequence) == "object" && sequence != null) {
        position = sequence.position;
        loading_callback = sequence.loading_callback;
        cycle_callback = sequence.cycle_callback;
        duration = sequence.duration;
        sequence = sequence.sequence;
    }

    if (!loading_callback) loading_callback = function () {};
    if (!cycle_callback) cycle_callback = function () {};
    if (!sequence) sequence = [];
    if (!position) position = [0, 0];

    if (duration != null) {
        var pos;
        for (pos = 0; pos < sequence.length; pos++)
            sequence[pos].duration = duration;
    }

    if (sequence.length >= 1 && typeof (sequence[0].item) == 'string') {
        var pos;
        var count = sequence.length;
        for (pos = 0; pos < count; pos++) {
            var temp = new Image();
            temp.src = sequence[pos].item;
            temp.onload =
                function () {
                    count--;
                    if (count <= 0) {
                        loading_callback();
                    }
            };
            sequence[pos].item = temp;
        }
    }

    this.position = position;
    this.sequence = sequence;
    this.current_item = 0;
    this.time_remaining = sequence[0].duration;
    this.last_time = false;
    this.draw = animation_draw;
    this.cycle_callback = cycle_callback;
}

var blah;

blah = new animation({
    sequence: [{
            item: "images/boss1.png"
        },
        //{item: "images/boss2.png"}
    ],
    position: [100, 20],
    loading_callback: function () {
        window.setInterval(function () {
            //blah.draw();
        }, 10)
    },
    duration: 1000,
    ctx: ctx
});

// Enemy class
var BossReady = false;
var BossImage = new Image();
BossImage.onload = function () {
    BossReady = true;
};

BossImage.src = "images/boss.png";

function Boss() {
    this.x = 100;
    this.y = 50;
    this.direction = "right";

    this.move = function () {

        if (blah.position[0] >= (win_width - blah.sequence[0].item.width)) {

            this.direction = "left";
        }

        if (blah.position[0] <= 0) {
            this.direction = "right";
        }


        if (this.direction == "right") {
            blah.position[0] = blah.position[0] + 8;
            //blah.draw();
        }
        if (this.direction == "left") {
            blah.position[0] = blah.position[0] - 1;
            //blah.draw();
        }
    }

    this.draw = function () {
        blah.draw();
    }
}

// Stars class
max_stars = 100;
star_speed = 2;

var allstars = new Array();
for (var i = 0; i < max_stars; i++) {
    var x = Math.floor(Math.random() * win_width);
    var y = Math.floor(Math.random() * win_height);
    var size = Math.floor(Math.random() * 2);
    s = [x, y, size];
    allstars.push(s)
}

function draw_stars() {
    for (var i = 0; i < allstars.length; i++) {

        if (allstars[i][1] > win_height) {
            allstars[i][1] = 0;
        }

        ctx.fillStyle = "#ffffff";
        star_x = allstars[i][0];

        if (allstars[i][2] == 0) {
            allstars[i][1] = allstars[i][1] + 2;
            ctx.fillStyle = "#adadad";
            ctx.fillRect(star_x, allstars[i][1], 1, 1);
        } else if (allstars[i][2] == 1) {
            allstars[i][1] = allstars[i][1] + 4;
            ctx.fillStyle = "#fff";
            ctx.fillRect(star_x, allstars[i][1], 2, 2);
        }

    }
}

// Player image
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function () {
    playerReady = true;
};
playerImage.src = "images/ship_b.png";

// Player
function Player() {
    this.img_num = 1;
    this.shots = [];
    this.x = (win_width / 2);
    this.y = (win_height / 2);

    this.shoot = function () {
        var s_x = this.x;
        var s_y = this.y;
        var s = new Shot(s_x, s_y);
        this.shots.push(s);
    }

    this.update_shots = function (boss) {

        this.shots = this.shots.filter(function (s) {
            return s.y > 0;
        })

        this.shots.forEach(function (s) {
            //ctx.drawImage(playerImage, 400,300);
            s.draw();
            var boss_width = boss.sequence[0].item.width;
            var boss_height = boss.sequence[0].item.height;
            var boss_y = boss.position[1];
            var boss_x = boss.position[0];
            var s_range_x = s.x - 10;
        });
    }

    this.draw = function () {
        ctx.drawImage(playerImage, this.x, this.y);
    }
}

// Random image
var RndReady = false;
var RndImage = new Image();
RndImage.onload = function () {
    RndReady = true;
};
RndImage.src = "images/bill.png";

// update hits

function update_enemies(player, boss) {
    player.shots = player.shots.filter(function (e) {
        return e.y > 0;
    })
    player.shots.forEach(function (e) {
        e.draw();
        var boss_width = boss.sequence[0].item.width;
        var boss_height = boss.sequence[0].item.height;
        var boss_y = boss.position[1];
        var boss_x = boss.position[0];
        player.shots.forEach(function (s) {
            if (s.x >= boss_x - 25 && s.x <= (boss_x + (boss_width - 25)) && s.y >= boss_y && s.y <= (boss_y + boss_height)) {
                //				console.log("hit");
                //				console.log(boss.sequence[0]["item"]);
                boss.sequence[0]["item"] = RndImage;
                blah.sequence[0]["item"] = RndImage;
                //				console.log(boss.sequence[0]["item"]);
                //ctx.drawImage(RndImage, s.x, s.y, 50, 50);
                var idx_s = player.shots.indexOf(s);
                player.shots.splice(idx_s, 1);
            } else if (s.y < 0) {
                var idx_s = player.shots.indexOf(s);
                player.shots.splice(idx_s, 1);
            } else {
                boss.sequence[0]["item"] = BossImage;
                blah.sequence[0]["item"] = BossImage;
            }


        });

    });
}


// Bullet image
var shotReady = false;
var shotImage = new Image();
shotImage.onload = function () {
    shotReady = true;
};
shotImage.src = "images/shot.png";

// Bullet class

function Shot(x, y) {
    this.x = x;
    this.range_low = x - 10;
    this.range_high = x + 10;


    //this.x = Math.floor(Math.random() * 10);
    this.y = y;
    this.size_w = 60;
    this.size_h = 30;
    this.img = shotImage;
    this.draw = function (x, y) {
        this.size_w -= 1.5;
        this.size_h -= 1;
        this.y = this.y - 20;
        //this.y = this.y - 20;
        ctx.drawImage(this.img, (this.x + 12), (this.y - 5));
    }
}

// Create instances
var player = new Player();
var boss = new Boss();


// Draw everything
var render = function () {
    if (level == 1) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, win_width, win_height);
        draw_stars();
        player.shoot();
        player.draw();
        player.update_shots(blah);
        update_enemies(player, blah);
        boss.move();
        boss.draw();
    }
};


// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    //update(delta / 1000);
    render();
    then = now;
};

function touchstart_handle(evt) {
    if (level == 1) {
        evt.preventDefault();
        //player.img_num = 2;
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var t_x = touches[i].pageX;
            var t_y = touches[i].pageY;
            player.x = t_x - 30;
            player.y = t_y - 100;
            //player.shoot();
        }
    }
}

function touchend_handle(evt) {
    player.img_num = 1;
}

addEventListener("touchstart", touchstart_handle, false);
addEventListener("touchmove", touchstart_handle, false);
addEventListener("touchend", touchend_handle, false);

// PLAYTIME
var then = Date.now();
setInterval(main, 10);