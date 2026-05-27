"use strict";
// 1.Crea un objeto inverso donde la llave sea la serie y el valor sea un arreglo de usuarios.

const dictionary= {"Cecilia": "One Piece", "Iván": "Naruto", "Miku": "One Piece"}

function invertDictionary(dictionary){
  const dictArray = Object.entries(dictionary)
  const finalDict={}
  for (const [name, anime] of dictArray){
    if(!finalDict[anime]){
      finalDict[anime]=[]  
    }
    finalDict[anime].push(name)
  }
  return finalDict
}
console.log( invertDictionary(dictionary))


// Esperado: {"One Piece": ["Cecilia", "Miku"], "Naruto": ["Iván"]}

// 2.Devuelve un objeto donde las llaves sean la longitud del nombre y el valor sea un arreglo con los nombres de esa longitud.

const animes=["Akira", "Naruto", "Nana", "Bleach"]

function animesByLong(animes){
  const longs={}
  for(const anime of animes){
    if(!longs[anime.length]){
      longs[anime.length] = []
    }
    longs[anime.length].push(anime)
  }
  return longs
}
console.log( animesByLong(animes))

// Esperado: {4: ["Nana"], 5: ["Akira"], 6: ["Naruto", "Bleach"]}

// 3.Devuelve el costo total de todo el carrito usando una sola línea de .reduce().

const cart=[{p: "Figura", q: 2, price: 50}, {p: "Manga", q: 5, price: 10}]

function totalCart(cart){
  return cart.reduce((acc,curr)=>{
    return acc + (curr.q*curr.price)
  },0)
}
console.log( totalCart(cart))

// Esperado: 60

// 4.Devuelve solo el nombre del usuario con el puntaje más alto.

const playersScore=[{name: "A", score: 50}, {name: "B", score: 90}, {name: "C", score: 80}]

function maxScore(playersScore){
  let topPlayer = playersScore[0]
  for (const player of playersScore){
    if(topPlayer.score < player.score) topPlayer=player
  }
  return maxScore.name;
}
console.log( maxScore(playersScore))

// Esperado: B

// 5.Devuelve un objeto con la frecuencia de cada letra.

const word="banana"

function countLetters(word){
  const counter={}
  for (const letter of word){
    if(!counter[letter]){
      counter[letter] = 0
    }
    counter[letter] +=1 
  }
  return counter
}
console.log( countLetters(word))

// Esperado: {b: 1, a: 3, n: 2}

//6. Devuelve un objeto que cuente cuántos usuarios hay por cada dominio.

const emails = ["a@crunchy.com", "b@gmail.com", "c@crunchy.com"];

function emailsPerDomain(emails){
  const counter={}
  for (const email of emails){
    const [name,domain]= email.split('@');
    if(!counter[domain]){
      counter[domain]=0;
    }
    counter[domain]+=1;
  }
  return counter
}
console.log( emailsPerDomain(emails))

// Esperado: {"crunchy.com": 2, "gmail.com": 1}


// 7. Reto: Devuelve el arreglo sin duplicados pero usando .filter() (No se vale usar new Set()).

const numbers=[1, 2, 2, 3, 4, 4, 5]

function deleteDuplicate(numbers){
  return numbers.filter((item,index)=> numbers.indexOf(item) === index)
}
console.log( deleteDuplicate(numbers))

// Esperado: [ 1, 2, 3, 4, 5 ]

// 8. Devuelve un nuevo arreglo con los elementos que aparecen en ambos arreglos.

const arr1= [1, 2, 3];
const arr2= [2, 3, 4];

// MI SOLUCION 
function intersection(arr1,arr2){
  const mutual=[]
  for (const number of arr1){
    if(arr2.includes(number)){
      mutual.push(number);
    }
  }
  return mutual
}
console.log( intersection(arr1,arr2))

// IA SOLUCION

function intersection2(arr1,arr2){
  return arr1.filter(num => arr2.includes(num));
}
console.log( intersection2(arr1,arr2))


//Esperado: [2, 3]

// 9. Devuelve true si el string tiene más de 8 caracteres Y contiene al menos un número.

const password="Galileo1104"

// MI SOLUCION
function isSecurePass(password){
  return password.split('').some(value=>value>0);
}
console.log( isSecurePass(password))

//IA SOLUCION 1
function isSecurePass2(password){
  const hasNumber = password.split('').some(char => !isNaN(parseInt(char)));
  return password.length > 8 && hasNumber;
}
console.log( isSecurePass2(password))

//IA SOLUCION 2
function isSecurePass3(password){
  const hasNumber = /\d/.test(password); 
  return password.length > 8 && hasNumber;
}
console.log( isSecurePass3(password))

//Esperado true

//10. Reto: Devuelve un solo arreglo con todos los números: [1, 2, 3, 4, 5, 6]

const matrix=[[1, 2], [3, 4], [5, 6]]

function flatMatrix(matrix){
  return matrix.reduce((acc, curr)=>{
    return [...acc,...curr]
  },[])
}
console.log('PLAINTREE', flatMatrix(matrix))

//Esperado:[ 1, 2, 3, 4, 5, 6 ]


//11. Sort ann array without sort method Bubble Sort

const numbers2 = [5, 2, 9, 1, 5, 6];

function BubbleSort(numbers2){
  const n =numbers2.length;
  let result= [...numbers2]
  for (let i =0; i<n;i++){
    for (let j=0; j<n-1-i;j++){
      if(result[j] > result[j+1]){
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }
  return result;
}
console.log('BUBBLESORT',BubbleSort(numbers2))

//12. QuickSort

const numbers3 = [5, 2, 9, 1, 5, 6];

function QuickSort(arr){
  if(arr.length <=1) return arr; //it means its sorted 
  const size= arr.length
  const pivot = arr[size-1]
  const left=[]
  const right=[]
  for (let i=0; i < size-1; i++){
    if(arr[i]>pivot){
      right.push(arr[i]);
    }else{
      left.push(arr[i]);
    }
  }
  return [...QuickSort(left),pivot,...QuickSort(right)]
}
console.log('QUICKSORT',QuickSort(numbers3))

//JEFE FINAL

const watchHistory = [
  "  One Piece : Shonen ",
  "Naruto:Shonen",
  "Kaguya-sama: Romance",
  "  Horimiya : Romance  ",
  "Demon Slayer:Shonen",
  "Konosuba: Isekai"
];

function getTopGenres(list){
  const arrFormatList=list.map(e=>{
    return e.split(':').map(e=> e.trim())
    });
    
  const animesPerGenre = {}
  console.log(arrFormatList)
  
  for(let i=0; i < arrFormatList.length ; i++){
    const [name,genre]= arrFormatList[i];
    if(!animesPerGenre[genre]){
      animesPerGenre[genre]=0
    }
    animesPerGenre[genre] +=1;
  }
  console.log(animesPerGenre)
  return Object.entries(animesPerGenre).filter(([genre,q])=>q>=2).sort((a,b) => b[1]-a[1]).map(([genre,q])=>genre)
}

console.log(getTopGenres(watchHistory))


//Ejercicios de nivel 2 
console.log("///////////////////////////////////")
//Reto: Queremos encontrar a los usuarios que hayan usado su acceso 3 o más veces dentro de un periodo de una hora (60 minutos).

const badgeRecords = [
  ["Paul", 1355], ["Cecilia", 830], ["Paul", 1315],
  ["Cecilia", 835], ["Paul", 1405], ["Paul", 1320],
  ["Cecilia", 855], ["Iván", 500]
];

function usedManyEntries(arr){
  const recordsPerUser={}
  const result={}
  for (let record of arr){
    if(!recordsPerUser[record[0]]){
      recordsPerUser[record[0]]=[]
    }
    recordsPerUser[record[0]].push(record[1])
  }
  
  for (let user in recordsPerUser) {
    recordsPerUser[user].sort((a, b) => a - b);
  }
  recordsPerUser['paco']=[100, 500, 510, 520, 900]
  
  console.log(recordsPerUser)
  
  for (let user in recordsPerUser){
    const times=recordsPerUser[user]
    
    for(let i =0;i< times.length;i++){
      console.log(i)
      const initialTime = times[i];
      const limitTime = initialTime + 60;
      
      const accesesInThatTime = times.filter(t => t>=initialTime && t<=limitTime)
      
      if (accesesInThatTime.length >=3){
        result[user]=accesesInThatTime;
        break;
      } 
    }
  }
  return result
}
console.log(usedManyEntries(badgeRecords))
   
// // ///////////////////////EJERCICIO NIVEL 2
const seatingChart = [
  ["O", "V", "O", "V"],
  ["V", "V", "V", "O"],
  ["O", "O", "V", "V"],
  ["V", "V", "O", "V"]
];

function validateSeating(arr){
  for (let i =1; i<arr.length-1; i ++){
    for (let j =1; j<arr.length-1; j ++){
      console.log('i,j', [i,j])
      if(arr[i][j] == 'V'){
      let up=arr[i-1][j]
      let down=arr[i+1][j]
      let left = arr[i][j-1]
      let right = arr[i][j+1]
        const isTrapped =[up,down,left,right].every(dato => dato === 'O')
        if (isTrapped) return false;  
      }
    }
  }
  return true;
}

console.log(validateSeating(seatingChart))

// ///////////////////////

function validateCoupon(couponCode) {
  console.log('couponCode',!couponCode?.trim() );
  if( !couponCode || couponCode.trim() === "") {
    return false;
  }
  
  console.log("Procesando cupón válido:", couponCode);
  return true;
}

// Ejemplo de uso que rompe la aplicación:
validateCoupon(undefined);

// ///////////////////////
const premiumUsers = ["user123", "user456", "user789", "user999"];

function isPremiumUser(userId) {
  return premiumUsers.some(user=> user === userId);
}

// ///////////////////////

 const minutosPerDay = [120, 90, 180, 170, 60, 300]
 const K = 3 // (días seguidos)
 const M = 450 //(minutos mínimos acumulados)

function hasValidMarathon(minutos, K, M) {
  let sumaVentana = 0;

  for (let i = 0; i < K; i++) {
    sumaVentana += minutos[i];
  }
console.log(sumaVentana)
  if (sumaVentana >= M) return true;

  for (let i = K; i < minutos.length; i++) {
    sumaVentana = sumaVentana - minutos[i - K] + minutos[i];
    console.log(sumaVentana)
    if (sumaVentana >= M) {
      return true;
    }
  }

  return false;
}

console.log(hasValidMarathon(minutosPerDay,K,M))

// ///////////////////////
const comentarios = ["¡Me encantó!", "Spoiler", "Buen capítulo", "Spoiler", "Spoiler", "¡Me encantó!"]
const limit = 2

function detectLimitOfComments(comments, limit){
  const result={};
  for(let com of comments){
    result[com] = (result[com] || 0) + 1;
    if(result[com]>limit){
      return com
    }
  }
  console.log(result)
  return null;
}
console.log(detectLimitOfComments(comentarios,limit))

// ///////////////////////


const trafico = [100, 200, 300, 400, 100]
const K2 = 3 //(Revisamos bloques de 3 minutos seguidos)
const L2 = 250 //(El promedio máximo permitido)

function hasExceedLimit(trafico, K, L) {
  let sumaDelPromedio=0;
  
  for(let i =0;i<K;i++){
    sumaDelPromedio += trafico[i];
  }

  if(sumaDelPromedio/K >= L) return true;
  
  for(let i =K;i< trafico.length ;i++){
    sumaDelPromedio = sumaDelPromedio - trafico[i-K] + trafico[i];
     if(sumaDelPromedio/K >= L) return true;
  }
  return false; 
}

console.log(hasExceedLimit(trafico,K2,L2))