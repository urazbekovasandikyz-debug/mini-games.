let nickname='', score=0, currentAvatar=null;

// ---------- Никнейм ----------
document.getElementById('startBtn').addEventListener('click',()=>{
  const val=document.getElementById('nicknameInput').value.trim();
  if(!val){alert('Введите ник!'); return;}
  nickname=val;
  document.getElementById('nicknameScreen').style.display='none';
  document.getElementById('menu').style.display='flex';
  updateWelcome();
});

function updateWelcome(){
  document.getElementById('welcomeText').innerHTML = `Привет, ${nickname} ${currentAvatar||''}`;
  document.getElementById('scoreDisplay').innerText = `Очки: ${score}`;
}

// ---------- Аватарки ----------
const avatars=['😀','😎','🤖','👽','🧙','🧝','🧛','🦸','🐉','🦄'];
document.getElementById('avatarBtn').addEventListener('click',()=>{
  document.getElementById('menu').style.display='none';
  const container=document.getElementById('avatarsContainer');
  container.innerHTML='';
  avatars.forEach((a,i)=>{
    const div=document.createElement('div');
    div.className='avatar';
    div.innerText=a;
    if(score>= (i+1)*10) div.classList.add('bonus');
    if(currentAvatar===a) div.classList.add('selected');
    div.onclick=()=>{
      currentAvatar=(currentAvatar===a)?null:a;
      updateWelcome();
      document.getElementById('avatarBtn').click(); // обновляем экран
    };
    container.appendChild(div);
  });
  document.getElementById('avatarScreen').style.display='flex';
});
document.querySelectorAll('#avatarScreen .backMenu').forEach(b=>b.onclick=()=>{
  document.getElementById('avatarScreen').style.display='none';
  document.getElementById('menu').style.display='flex';
});

// ---------- Камень-Ножницы-Бумага ----------
const rpsGame=document.getElementById('rpsGame');
const rpsAnim=document.getElementById('rpsAnim');
const rpsResult=document.getElementById('rpsResult');
document.getElementById('rpsBtn').addEventListener('click',()=>{
  document.getElementById('menu').style.display='none';
  rpsGame.style.display='flex';
  rpsResult.innerText=''; rpsAnim.innerText='🤖';
});
document.querySelectorAll('#rpsGame .rpsChoice').forEach(btn=>{
  btn.onclick=()=>playRPS(btn.innerText);
});
document.querySelectorAll('#rpsGame .backMenu').forEach(b=>b.onclick=()=>{
  rpsGame.style.display='none';
  document.getElementById('menu').style.display='flex';
});

function playRPS(player){
  const options=['🪨','✂️','🧻'];
  rpsResult.innerText=''; rpsAnim.innerText='🤖';
  let count=0;
  const anim=setInterval(()=>{
    rpsAnim.innerText=options[Math.floor(Math.random()*3)];
    count++;
    if(count>10){
      clearInterval(anim);
      const bot=options[Math.floor(Math.random()*3)];
      rpsAnim.innerText=bot;
      let result='';
      if(player===bot) result='Ничья!';
      else if((player==='🪨' && bot==='✂️')||(player==='✂️' && bot==='🧻')||(player==='🧻' && bot==='🪨')) result='Ты выиграл!';
      else result='Бот выиграл!';
      if(result==='Ты выиграл!') {score+=5; updateWelcome();}
      rpsResult.innerText=`Ты: ${player} | Бот: ${bot} → ${result}`;
    }
  },100);
}

// ---------- Крестики-нолики ----------
const ticGame=document.getElementById('ticGame');
const ticBoard=document.getElementById('ticBoard');
const ticResult=document.getElementById('ticResult');
let board=[];
document.getElementById('ticBtn').addEventListener('click',()=>{
  document.getElementById('menu').style.display='none';
  ticGame.style.display='flex';
  initTic();
});
document.querySelectorAll('#ticGame .backMenu').forEach(b=>{
  b.onclick=()=>{
    ticGame.style.display='none';
    document.getElementById('menu').style.display='flex';
  };
});
function initTic(){board=Array(9).fill(''); ticBoard.innerHTML=''; ticResult.innerText=''; for(let i=0;i<9;i++){const cell=document.createElement('div');cell.className='cell';cell.dataset.index=i;cell.onclick=()=>playerMove(i);ticBoard.appendChild(cell);}}
function playerMove(i){if(board[i]!=='') return; board[i]='X'; renderBoard(); if(checkWinner('X')){ticResult.innerText='Ты выиграл!'; score+=5; updateWelcome(); return;} setTimeout(botMove,200);}
function botMove(){let empty=board.map((v,i)=>v===''?i:null).filter(v=>v!==null); if(empty.length===0){ticResult.innerText='Ничья!'; return;} const move=empty[Math.floor(Math.random()*empty.length)]; board[move]='O'; renderBoard(); if(checkWinner('O')){ticResult.innerText='Бот выиграл!'; return;} if(board.every(v=>v!=='')) ticResult.innerText='Ничья!';}
function renderBoard(){for(let i=0;i<9;i++) ticBoard.children[i].innerText=board[i];}
function checkWinner(p){const win=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; return win.some(line=>line.every(idx=>board[idx]===p));}

// ---------- Расписание ----------
const schedule={
  "1":["Қазақ тілі","Дж/тарих","Алгебра","Құқық негіздері","Ағылшын","География (ф)","Дене шын-у","Сынып сағаты"],
  "2":["Қазақ әдебиет","Информатика","Қазақ т (ф)","Геометрия","Химия","География","Орыс т"],
  "3":["Ағылшын","Информатика","Биология","Алгебра","Физика","Қазақстан тарих","География"],
  "4":["АӘД","Геометрия","Алгебра","Қазақстан тарих","Химия","Дене шын-у","Орыс т"],
  "5":["Қазақ әдебиет","Алгебра","Физика","Биология","Дене шын-у","Ағылшын","Жаһандық құз (ф)"]
};

const scheduleModal=document.getElementById('scheduleModal');
const daysButtons=document.getElementById('daysButtons');
for(let i=1;i<=5;i++){
  const btn=document.createElement('button'); btn.innerText=i+' день'; btn.onclick=(()=>showDay(i)); daysButtons.appendChild(btn);
}
document.getElementById('scheduleBtn').onclick=()=>{
  document.getElementById('menu').style.display='none';
  scheduleModal.classList.add('active');
  showDay(1);
};
document.getElementById('closeScheduleBtn').onclick=()=>{
  scheduleModal.classList.remove('active');
  document.getElementById('menu').style.display='flex';
};
function showDay(day){
  const lessons = schedule[day.toString()].map((l,i)=>`${i+1}. ${l}`).join("<br>");
  document.getElementById('dayContent').innerHTML = `<h3>${day} день</h3>${lessons}`;
}

// ---------- Модалки "О нас" и "Правила" ----------
document.getElementById('aboutBtn').onclick=()=>{document.getElementById('menu').style.display='none'; document.getElementById('aboutModal').classList.add('active');};
document.getElementById('rulesBtn').onclick=()=>{document.getElementById('menu').style.display='none'; document.getElementById('rulesModal').classList.add('active');};
document.querySelectorAll('.closeModal').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.modal').forEach(m=>m.classList.remove('active'));
  document.getElementById('menu').style.display='flex';
});
