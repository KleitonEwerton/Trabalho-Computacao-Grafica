// ?       type:    {

//!                 normal: vai de cima para baixo
//!                 diagonal: vai da direita para a esquerda ou esquerda para diretia na diagonal, 
//!                     a direção depende de angleY, angles negativos esquerda para direita, positivos direita para esquerda
//!                 parable:  vai da direita para a esquerda ou esquerda para diretia em forma de parabola, 
//!                     a direção depende se o seu x inicial e positivo ou negativo
//!                 terrestrial: um lança missil que deve ser posicionado no chao
//?                 }
//!
//?         angleY  {

//!                 para os type (normal e diagonal) serve para rotacionar o avião durante a criação do objeto, considere um angleY de 0ª, 45ª ou -45ª, 
//!                     já para o em type(parable) e a rotação durante seu movimento considere angleY de 0.0025.Os terrestriais são virados para frete usando um angulo de 180ª APENAS SUGESTÃO

//?                 }
//?         posx    {

//!                 para types (normal) deve-se usar posx onde o player possa ir

//?                 }

export let enemys = {

  "-1": { type: "diagonal", posx: -250, posy: 10, angleY: 90 },
  "-2": { type: "diagonal", posx: 250, posy: 10, angleY: -90 },
  "-3": { type: "terrestrial", posx: -20, posy: 0, angleY: 180 },
  "-4": { type: "terrestrial", posx: 20, posy: 0, angleY: 180 },
  "-6": { type: "normal", posx: -36, posy: 10, angleY: 0 },
  "-7": { type: "normal", posx: 36, posy: 10, angleY: 0 },
  "-8": { type: "diagonal", posx: -250, posy: 10, angleY: 90 },
  "-9": { type: "diagonal", posx: 250, posy: 10, angleY: -90 },
  "-15": { type: "parable", posx: -80, posy: 10, angleY: 0.0025 },
  "-20": { type: "parable", posx: 80, posy: 10, angleY: 0.0025 },
  "-25": { type: "diagonal", posx: -60, posy: 10, angleY: 45 },
  "-20": { type: "diagonal", posx: 60, posy: 10, angleY: -45 },
  
};
