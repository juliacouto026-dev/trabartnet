const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d");

let lastText = "";

function resize(){

    canvas.width =
    window.innerWidth;

    canvas.height =
    window.innerHeight;

    if(started && lastText){

        wordPoints =
        generateWordPoints(lastText);

        if(forming){

            particles.forEach(
            (p,i)=>{

                const target =
                wordPoints[
                    i %
                    wordPoints.length
                ];

                p.tx = target.x;
                p.ty = target.y;
            });
        }
    }
}

const TOTAL = 1800;

const particles = [];

let started = false;
let forming = false;
let wordPoints = [];

resize();

const colors = [
"#ff1493",
"#ff69b4",
"#ffc0cb",
"#ff85c1",
"#db7093"
];

for(let i=0;i<TOTAL;i++){

    particles.push({

        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,

        vx:(Math.random()-0.5)*3,
        vy:(Math.random()-0.5)*3,

        size:0.8+Math.random()*1.8,

        alpha:0,
        targetAlpha:0,

        tx:0,
        ty:0,

        color:
        colors[
            Math.floor(
                Math.random()*colors.length
            )
        ]
    });
}

function generateWordPoints(text){

    const off =
    document.createElement("canvas");

    off.width =
    canvas.width;

    off.height =
    canvas.height;

    const octx =
    off.getContext("2d");

    let fontSize = 260;

    if(text.length > 5)
        fontSize = 180;

    if(text.length > 8)
        fontSize = 130;

    octx.clearRect(
        0,
        0,
        off.width,
        off.height
    );

    octx.textAlign =
    "center";

    octx.textBaseline =
    "middle";

    const maxWidth =
    off.width * 0.9;

    octx.font =
    `700 ${fontSize}px "Bitcount Grid Double"`;

    while(
        octx.measureText(
            text.toUpperCase()
        ).width > maxWidth &&
        fontSize > 10
    ){

        fontSize -= 5;

        octx.font =
        `700 ${fontSize}px "Bitcount Grid Double"`;
    }

    octx.fillStyle =
    "black";

    octx.fillText(
        text.toUpperCase(),
        off.width/2,
        off.height/2
    );

    const data =
    octx.getImageData(
        0,
        0,
        off.width,
        off.height
    ).data;

    const points = [];

    for(let y=0;y<off.height;y+=7){

        for(let x=0;x<off.width;x+=7){

            const index =
            (y*off.width+x)*4;

            if(data[index+3] > 100){

                points.push({
                    x,
                    y
                });
            }
        }
    }

    return points;
}

document
.getElementById("startBtn")
.addEventListener(
"click",
async ()=>{

    const text =
    document
    .getElementById("wordInput")
    .value
    .trim();

    if(!text) return;

    await document.fonts.ready;

    lastText = text;

    wordPoints =
    generateWordPoints(text);

    document
    .getElementById("startScreen")
    .style.display =
    "none";

    started = true;

    particles.forEach(p=>{

        p.targetAlpha = 1;
    });
});

canvas.addEventListener(
"click",
()=>{

    if(!started) return;
    if(!wordPoints.length) return;

    forming = !forming;

    if(forming){

        particles.forEach(
        (p,i)=>{

            const target =
            wordPoints[
                i %
                wordPoints.length
            ];

            p.tx = target.x;
            p.ty = target.y;
        });
    }
});

function animate(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particles.forEach(p=>{

        p.alpha +=
        (p.targetAlpha-p.alpha)
        *0.04;

        if(forming){

            p.x +=
            (p.tx-p.x)
            *0.07;

            p.y +=
            (p.ty-p.y)
            *0.07;

        }else{

            p.x += p.vx;
            p.y += p.vy;

            if(
                p.x < 0 ||
                p.x > canvas.width
            ){
                p.vx *= -1;
            }

            if(
                p.y < 0 ||
                p.y > canvas.height
            ){
                p.vy *= -1;
            }
        }

        ctx.globalAlpha =
        p.alpha;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI*2
        );

        ctx.fillStyle =
        p.color;

        ctx.fill();
    });

    ctx.globalAlpha = 1;

    requestAnimationFrame(
        animate
    );
}

animate();

window.addEventListener(
"resize",
resize
);